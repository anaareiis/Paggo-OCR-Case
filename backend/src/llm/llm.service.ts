// backend/src/llm/llm.service.ts
import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly openaiKey = process.env.OPENAI_API_KEY || '';
  private readonly openaiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  constructor(private readonly prisma: PrismaService) {}

  private buildPrompt(ocrText: string, question: string) {
    const MAX_CONTEXT_CHARS = 30000;
    let context = ocrText || '';
    if (context.length > MAX_CONTEXT_CHARS) {
      context = context.slice(context.length - MAX_CONTEXT_CHARS);
    }
    const system = `You are a helpful assistant that answers user questions based ONLY on the provided document text.`;
    const user = `DOCUMENT:\n${context}\n\nQUESTION:\n${question}\n\nAnswer using only the document text.`;
    return { system, user };
  }

  async askLLM(ocrText: string, question: string) {
    if (!this.openaiKey) {
      this.logger.warn('OPENAI_API_KEY not set — returning mock answer.');
      return { provider: 'mock', answer: `Mock: I would search the document for "${question}".`, raw: null };
    }

    const { system, user } = this.buildPrompt(ocrText, question);

    const messages = [{ role: 'system', content: system }, { role: 'user', content: user }];

    const resp = await axios.post(
      this.openaiUrl,
      { model: this.model, messages, temperature: 0.0, max_tokens: 1000 },
      { headers: { Authorization: `Bearer ${this.openaiKey}`, 'Content-Type': 'application/json' }, timeout: 60000 },
    );

    const choice = resp.data?.choices?.[0];
    const answer = choice?.message?.content ?? choice?.text ?? '';
    return { provider: 'openai', answer: (answer || '').trim(), raw: resp.data };
  }

  /**
   * Main flow:
   *  - verify document exists (and optionally ownership)
   *  - load OCR text
   *  - call LLM (or mock)
   *  - persist LLMInteraction using Prisma typed input (connect relations)
   */
  async askDocument(documentId: string, question: string, userId?: string | undefined) {
    // ensure document exists
    const doc = await this.prisma.prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    // optional ownership check: if userId is provided, ensure the document belongs to them
    if (userId && doc.userId !== userId) {
      // hide existence to other users by throwing NotFound or Forbidden.
      throw new NotFoundException('Document not found');
    }

    // load OCR text (may be empty)
    const ocr = await this.prisma.prisma.oCRResult.findUnique({ where: { documentId } });
    const ocrText = ocr?.extractedText ?? '';

    // call LLM (or mocked)
    const llmResult = await this.askLLM(ocrText, question);

    // build typed data object for Prisma (use relation connect pattern)
    const data: Prisma.LLMInteractionCreateInput = {
      question,
      answer: llmResult.answer ?? '',
      provider: llmResult.provider ?? 'mock',
      rawResponse: llmResult.raw ?? undefined,
      // connect document relation
      document: { connect: { id: documentId } },
      // user relation: include only if userId provided
      ...(userId ? { user: { connect: { id: userId } } } : {}),
    };

    // create interaction
    const interaction = await this.prisma.prisma.lLMInteraction.create({
      data,
    });

    return { answer: llmResult.answer, interaction };
  }
}

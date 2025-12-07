// backend/src/llm/llm.controller.ts
import { Controller, Post, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { LlmService } from './llm.service';
import { MockUserGuard } from '../auth/auth.guard';
import { CurrentUserId } from '../auth/auth.decorator';

@Controller('documents')
export class LlmController {
  constructor(private readonly llm: LlmService) {}

  @UseGuards(MockUserGuard)
  @Post(':id/explain')
  async explain(
    @Param('id') id: string,
    @Body('question') question: string,
    @CurrentUserId() userId?: string,
  ) {
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      throw new BadRequestException('question is required in the body');
    }

    const safeUserId: string | undefined = (userId ?? undefined);
    const res = await this.llm.askDocument(id, question.trim(), safeUserId);
    
    return { answer: res.answer, interactionId: res.interaction.id };
  }
}

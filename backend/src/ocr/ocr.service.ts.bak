// backend/src/ocr/ocr.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import tesseract from 'node-tesseract-ocr';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Run OCR for a document (by documentId).
   * Returns object { status, extractedText, meta }.
   */
  async runOcrForDocument(documentId: string) {
    // fetch document
    const doc = await this.prisma.prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    const absolutePath = path.join(process.cwd(), doc.storagePath);

    // prepare metadata
    const meta: any = {
      status: 'pending',
      startedAt: new Date().toISOString(),
      pages: 0,
      pageTexts: [],
      errors: null,
      durationsMs: {},
    };

    // persist a "pending" OCRResult entry or update existing one
    // we'll create a placeholder with extractedText = '' and meta.status = 'pending'
    let ocrRecord;
    try {
      ocrRecord = await this.prisma.prisma.oCRResult.create({
        data: {
          documentId: documentId,
          extractedText: '',
          ocrMeta: meta,
        },
      });
    } catch (err) {
      // if unique constraint (already exists), update instead
      this.logger.warn('Could not create initial OCRResult placeholder, trying update. ' + String(err));
      try {
        ocrRecord = await this.prisma.prisma.oCRResult.upsert({
          where: { documentId },
          update: { extractedText: '', ocrMeta: meta, extractedAt: new Date() },
          create: { documentId, extractedText: '', ocrMeta: meta },
        });
      } catch (e) {
        this.logger.error('Failed to upsert OCRResult placeholder: ' + String(e));
      }
    }

    const startAll = Date.now();

    try {
      let imagesToProcess: string[] = [];

      if (!fs.existsSync(absolutePath)) {
        throw new Error('File not found on disk: ' + absolutePath);
      }

      const ext = path.extname(absolutePath).toLowerCase();

      if (ext === '.pdf') {
        // convert PDF to PNG pages using pdftoppm
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `ocr-${documentId}-`));
        const outPrefix = path.join(tmpDir, 'page');
        // -png will output page-1.png, page-2.png ...
        const cmd = `pdftoppm -png -r 300 "${absolutePath}" "${outPrefix}"`;
        this.logger.log(`Converting PDF to images: ${cmd}`);
        execSync(cmd, { stdio: 'ignore' });
        // collect generated PNG files
        const files = fs.readdirSync(tmpDir).filter((f) => f.toLowerCase().endsWith('.png')).sort();
        imagesToProcess = files.map((f) => path.join(tmpDir, f));
        meta.pages = imagesToProcess.length;
        meta.tmpDir = tmpDir;
      } else {
        // image -> process directly
        imagesToProcess = [absolutePath];
        meta.pages = 1;
      }

      const pageTexts: string[] = [];
      for (let i = 0; i < imagesToProcess.length; i++) {
        const img = imagesToProcess[i];
        const t0 = Date.now();
        this.logger.log(`Running Tesseract on ${img} (page ${i + 1}/${imagesToProcess.length})`);
        // tesseract options (language can be configured)
        const config = {
          lang: 'eng', // change if you need other languages and installed in tesseract
          oem: 1,
          psm: 3,
        };
        const text = await tesseract.recognize(img, config);
        const dt = Date.now() - t0;
        meta.pageTexts.push({ page: i + 1, durationMs: dt, length: text.length });
        pageTexts.push(text);
      }

      const extractedText = pageTexts.join('\n\n----- PAGE BREAK -----\n\n');

      meta.status = 'success';
      meta.finishedAt = new Date().toISOString();
      meta.durationMs = Date.now() - startAll;

      // update or create OCRResult in DB
      const payload = {
        extractedText,
        ocrMeta: meta,
        extractedAt: new Date(),
      };

      // upsert (create or update)
      const result = await this.prisma.prisma.oCRResult.upsert({
        where: { documentId },
        update: payload,
        create: { documentId, ...payload },
      });

      // cleanup tmpDir if used
      if (meta.tmpDir) {
        try {
          const tmpDir = meta.tmpDir;
          fs.readdirSync(tmpDir).forEach((f) => fs.unlinkSync(path.join(tmpDir, f)));
          fs.rmdirSync(tmpDir);
        } catch (e) {
          this.logger.warn('Failed to clean tmpDir: ' + String(e));
        }
      }

      return { status: 'success', extractedText, meta, db: result };
    } catch (err) {
      this.logger.error('OCR failed: ' + String(err));
      meta.status = 'error';
      meta.finishedAt = new Date().toISOString();
      meta.durationMs = Date.now() - startAll;
      meta.errors = String(err);

      // update OCRResult with error meta
      try {
        await this.prisma.prisma.oCRResult.upsert({
          where: { documentId },
          update: { extractedText: '', ocrMeta: meta, extractedAt: new Date() },
          create: { documentId, extractedText: '', ocrMeta: meta },
        });
      } catch (uerr) {
        this.logger.warn('Failed to upsert OCRResult error entry: ' + String(uerr));
      }

      return { status: 'error', error: String(err), meta };
    }
  }
}

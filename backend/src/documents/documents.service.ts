// backend/src/documents/documents.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persist a document record in DB.
   * If userId is not provided, attempts to find the first user; if none exists, creates a fallback user.
   */
  async createDocumentRecord(params: {
    originalName: string;
    storagePath: string;
    mimeType: string;
    size: number;
    userId?: string | null;
  }) {
    let { userId } = params;

    if (!userId) {
      // Try to find an existing user
      const existing = await this.prisma.prisma.user.findFirst();
      if (existing) {
        userId = existing.id;
      } else {
        // Create a fallback local user for development
        const u = await this.prisma.prisma.user.create({
          data: {
            email: `local+${randomUUID().slice(0,8)}@dev.local`,
            name: 'local',
            password: null,
          },
        });
        userId = u.id;
        this.logger.log(`Created fallback user ${userId} for document`);
      }
    }

    const doc = await this.prisma.prisma.document.create({
      data: {
        originalName: params.originalName,
        storagePath: params.storagePath,
        mimeType: params.mimeType,
        size: params.size,
        userId,
      },
    });

    return doc;
  }

  /**
   * Ensure upload directory exists and return the final storage path (relative)
   */
  ensureUploadDir() {
    const uploadsRoot = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsRoot)) {
      fs.mkdirSync(uploadsRoot, { recursive: true, mode: 0o755 });
    }
    return uploadsRoot;
  }
}

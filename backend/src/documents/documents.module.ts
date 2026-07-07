// backend/src/documents/documents.module.ts
import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DatabaseModule } from '../prisma.module';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [DatabaseModule, OcrModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, ],
})
export class DocumentsModule {}

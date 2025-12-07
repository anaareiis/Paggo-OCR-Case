// backend/src/ocr/ocr.module.ts
import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { DatabaseModule } from '../prisma.module';
import { MockUserGuard } from '../auth/auth.guard';

@Module({
  imports: [DatabaseModule],
  providers: [OcrService, MockUserGuard],
  controllers: [OcrController],
})
export class OcrModule {}

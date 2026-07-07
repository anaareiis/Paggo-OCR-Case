// backend/src/ocr/ocr.module.ts
import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { DatabaseModule } from '../prisma.module';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  imports: [DatabaseModule],
  providers: [OcrService, ],
  controllers: [OcrController],
  exports: [OcrService],
})
export class OcrModule {}

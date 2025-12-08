// backend/src/app.module.ts (only the imports/update)
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './prisma.module';
import { DocumentsModule } from './documents/documents.module'; 
import { OcrModule } from './ocr/ocr.module';
import { LlmModule } from './llm/llm.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, DocumentsModule, OcrModule, LlmModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
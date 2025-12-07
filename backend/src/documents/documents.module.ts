// backend/src/documents/documents.module.ts
import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DatabaseModule } from '../prisma.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}

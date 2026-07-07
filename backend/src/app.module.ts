// backend/src/app.module.ts (only the imports/update)
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './prisma.module';
import { DocumentsModule } from './documents/documents.module'; // <-- add this

@Module({
  imports: [DatabaseModule, DocumentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// backend/src/llm/llm.module.ts
import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { DatabaseModule } from '../prisma.module'; 
import { MockUserGuard } from '../auth/auth.guard';

@Module({
  imports: [DatabaseModule],
  providers: [LlmService, MockUserGuard],
  controllers: [LlmController],
})
export class LlmModule {}

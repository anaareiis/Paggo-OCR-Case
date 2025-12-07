// backend/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
constructor(private readonly prismaService: PrismaService) {}

  @Get('health')
  async health() {
  const users = await this.prismaService.prisma.user.findMany();
    return { ok: true, usersCount: users.length, users };
  }
}

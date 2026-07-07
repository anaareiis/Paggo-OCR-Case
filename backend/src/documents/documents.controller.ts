// backend/src/documents/documents.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentsService } from './documents.service';
import { MockUserGuard } from '../auth/auth.guard';
import { CurrentUserId } from '../auth/auth.decorator';

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf',
];

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // upload stays public (optionally you can protect it too)
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadsRoot = `${process.cwd()}/uploads`;
          cb(null, uploadsRoot);
        },
        filename: (req, file, cb) => {
          const id = uuidv4();
          const ext = extname(file.originalname) || '';
          cb(null, `${id}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (ALLOWED_MIMES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `File type not allowed. Allowed types: ${ALLOWED_MIMES.join(', ')}`,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const storagePath = `uploads/${file.filename}`;
    const record = await this.documentsService.createDocumentRecord({
      originalName: file.originalname,
      storagePath,
      mimeType: file.mimetype,
      size: file.size,
      userId: userId || null,
    });
    return {
      id: record.id,
      originalName: record.originalName,
      storagePath: record.storagePath,
      mimeType: record.mimeType,
      size: record.size,
      createdAt: record.createdAt,
    };
  }

  // ---- Protected endpoints: require x-user-id header ----
  @UseGuards(MockUserGuard)
  @Get()
  async list(
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
    @CurrentUserId() userId?: string,
  ) {
    const l = Math.min(100, parseInt(limit as any, 10) || 20);
    const o = Math.max(0, parseInt(offset as any, 10) || 0);
    const data = await this.documentsService.listDocuments({ limit: l, offset: o, userId: userId || null });
    return data;
  }

  @UseGuards(MockUserGuard)
  @Get(':id')
  async getOne(@Param('id') id: string, @CurrentUserId() userId?: string) {
    const doc = await this.documentsService.getDocumentById(id);
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    // enforce ownership
    if (doc.userId !== userId) {
      throw new NotFoundException('Document not found'); // hide existence to other users
    }
    return doc;
  }
}

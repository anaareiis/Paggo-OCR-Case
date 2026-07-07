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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentsService } from './documents.service';

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

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit (adjust as needed)
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Ensure upload dir exists
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

    // Build storagePath relative to project root
    const storagePath = `uploads/${file.filename}`;

    // Create DB record
    const record = await this.documentsService.createDocumentRecord({
      originalName: file.originalname,
      storagePath,
      mimeType: file.mimetype,
      size: file.size,
      userId: userId || null,
    });

    // Return useful metadata
    return {
      id: record.id,
      originalName: record.originalName,
      storagePath: record.storagePath,
      mimeType: record.mimeType,
      size: record.size,
      createdAt: record.createdAt,
    };
  }
}

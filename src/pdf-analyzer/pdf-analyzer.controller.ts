import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PdfAnalyzerService } from './pdf-analyzer.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('pdf-analyzer')
@Controller('pdf-analyzer')
export class PdfAnalyzerController {
  constructor(private readonly pdfAnalyzerService: PdfAnalyzerService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // >> Max 10 MB per pdf
    }),
  )
  @Post('cv-job-match')
  public async analyzeCvJobMatch(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.pdfAnalyzerService.analyzeCvJobMatch(files);
  }
}

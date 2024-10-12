import { Injectable } from '@nestjs/common';
import { VertexAiApiService } from '../vertex-ai-api/vertex-ai-api.service';

import { fromBuffer } from 'pdf2pic';

@Injectable()
export class PdfAnalyzerService {
  constructor(private readonly vertexAiApiService: VertexAiApiService) {}

  public async testPdfAnalyze() {
    return 'To be implemented';
  }

  public async analyzeCvJobMatch(pdfs: Express.Multer.File[]) {
    const pdfToImagesResult = await Promise.all(
      pdfs.map((pdf) => this._convertSinglePdfToB64Images(pdf.buffer)),
    );

    const images = pdfToImagesResult.flatMap((pdfResult) =>
      pdfResult.map((pdfImageData) => pdfImageData.base64),
    );

    return this.vertexAiApiService.analyzeCvJobMatch(images);
  }

  private async _convertSinglePdfToB64Images(pdfBuffer: Buffer) {
    const options = {
      density: 100,
      format: 'png',
      width: 600,
      height: 800,
      quality: 100,
    };

    const base64Images = await fromBuffer(pdfBuffer, options).bulk(-1, {
      responseType: 'base64',
    });

    return base64Images;
  }
}

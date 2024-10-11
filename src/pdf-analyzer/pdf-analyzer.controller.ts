import { Controller, Get } from '@nestjs/common';
import { PdfAnalyzerService } from './pdf-analyzer.service';

@Controller('pdf-analyzer')
export class PdfAnalyzerController {
  constructor(private readonly pdfAnalyzerService: PdfAnalyzerService) {}

  @Get('test-pdf-analyze-with-vertex-api')
  public async testPdfAnalyzeWithVertexApi() {
    return this.pdfAnalyzerService.testPdfAnalyze();
  }
}

import { Module } from '@nestjs/common';
import { VertexAiApiModule } from 'src/vertex-ai-api';
import { PdfAnalyzerService } from './pdf-analyzer.service';
import { PdfAnalyzerController } from './pdf-analyzer.controller';

@Module({
  imports: [VertexAiApiModule],
  controllers: [PdfAnalyzerController],
  providers: [PdfAnalyzerService],
})
export class PdfAnalyzerModule {}

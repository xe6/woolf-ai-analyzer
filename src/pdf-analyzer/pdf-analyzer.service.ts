import { Injectable } from '@nestjs/common';
import { VertexAiApiService } from '../vertex-ai-api/vertex-ai-api.service';

@Injectable()
export class PdfAnalyzerService {
  constructor(private readonly vertexAiApiService: VertexAiApiService) {}

  public async testPdfAnalyze() {
    return this.vertexAiApiService.testVertexApi();
  }
}

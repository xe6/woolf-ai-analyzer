import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { VertexAiApiModule } from './vertex-ai-api';
import { PdfAnalyzerModule } from './pdf-analyzer';

@Module({
  imports: [ConfigModule, VertexAiApiModule, PdfAnalyzerModule],
})
export class RootModule {}

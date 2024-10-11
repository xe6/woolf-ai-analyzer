import { Module } from '@nestjs/common';
import { RootController } from './root.controller';
import { RootService } from './root.service';
import { ConfigModule } from './config';
import { VertexAiApiModule } from './vertex-ai-api';
import { PdfAnalyzerModule } from './pdf-analyzer';

@Module({
  imports: [ConfigModule, VertexAiApiModule, PdfAnalyzerModule],
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule {}

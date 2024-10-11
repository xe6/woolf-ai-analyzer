import { Module } from '@nestjs/common';
import { VertexAiApiService } from './vertex-ai-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 7000,
    }),
  ],
  providers: [VertexAiApiService],
  exports: [VertexAiApiService],
})
export class VertexAiApiModule {}

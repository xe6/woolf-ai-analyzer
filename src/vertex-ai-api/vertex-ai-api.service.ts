import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService, EnvKeys } from 'src/config';
import { FilePart, TextPart, VertexAIRequest } from './types';

@Injectable()
export class VertexAiApiService {
  private endpoint: string;
  private authToken: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.endpoint = this.configService.get(EnvKeys.VERTEX_ENDPOINT);
    this.authToken = this.configService.get(EnvKeys.VERTEX_AUTH_TOKEN);
  }

  public async testVertexApi() {
    return this._sendRequest(
      {
        text: 'You are HR recruiter at Google. Please review the resume and provide feedback. What are candidates key strengths?',
      },
      {
        fileData: {
          fileUri:
            'https://cv.djinni.co/83/a7dd759e724fbb648664ac0b2955fa/Max_CV_Oct.pdf',
          mimeType: 'application/pdf',
        },
      },
    );
  }

  private async _sendRequest(textPart: TextPart, filePart: FilePart) {
    const payload: VertexAIRequest = {
      contents: [
        {
          role: 'user',
          parts: [textPart, filePart],
        },
      ],
    };

    try {
      const response = await this.httpService.axiosRef.post(
        this.endpoint,
        payload,
        {
          headers: {
            Authorization: this.authToken,
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
}

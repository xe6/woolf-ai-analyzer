import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService, EnvKeys } from 'src/config';
import { Part, VertexAIRequest } from './types';

@Injectable()
export class VertexAiApiService {
  private endpoint: string;
  private authToken: string;

  private logger = new Logger(VertexAiApiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.endpoint = this.configService.get(EnvKeys.VERTEX_ENDPOINT);
    this.authToken = this.configService.get(EnvKeys.VERTEX_AUTH_TOKEN);
  }

  private async _sendRequest(parts: Part[]) {
    const payload: VertexAIRequest = {
      contents: [
        {
          role: 'user',
          parts,
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
      this.logger.error(err?.response?.data);
      throw new InternalServerErrorException(
        'Failed to send request to Vertex AI.',
      );
    }
  }
}

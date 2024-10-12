import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService, EnvKeys } from 'src/config';
import { InlineDataPart, Part, TextPart, VertexAIRequest } from './types';

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

  /**
   * Analyzes the match between candidate CVs and job descriptions based on provided images of cv and job desciption.
   *
   * @param images - An array of base64 encoded images representing candidate CVs and job descriptions.
   * @returns A promise that resolves to the analysis result
   */
  public async analyzeCvJobMatch(images: string[]): Promise<any> {
    const textPart: TextPart = {
      text: `You are a company recruiter. Given a set of images, representing candidate CV and job description 
      (figure out which images belongs to what type of document), provide your feedback on the match between the 
      candidate CV and the job description, identifying the candidate's strengths and weaknesses, and whether the 
      candidate is a good fit for the job. Also, please provide a percentage match in the end of the response string 
      in this format: <Percentage match: x%>, where x is calculated match percentage.`,
    };

    const inlineDataParts: InlineDataPart[] = images.map((image) => ({
      inlineData: {
        mimeType: 'image/png',
        data: image,
      },
    }));

    const parts = [textPart, ...inlineDataParts];

    return this._sendRequest(parts);
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

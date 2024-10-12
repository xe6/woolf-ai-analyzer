import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService, EnvKeys } from 'src/config';
import {
  CvJobMatchAnalysisResult,
  InlineDataPart,
  Part,
  TextPart,
  VertexAIRequest,
} from './types';

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
  public async analyzeCvJobMatch(
    images: string[],
  ): Promise<CvJobMatchAnalysisResult> {
    const textPart: TextPart = {
      text: `You are a company recruiter. Given a set of images representing a candidate’s CV and a job description 
      (identify which image corresponds to each document), 
      analyze the match between the candidate’s qualifications and the job requirements. 
      Provide feedback on the candidate’s strengths, weaknesses, and overall fit for the role. 
      Conclude with a percentage match, formatted as: <Percentage match: x%>, where x is the calculated match percentage. 
      When calculating the percentage, be critical and avoid inflating the score; if the match is poor, give a low percentage. 
      When constructing percentage match, don't use any additional text formatting.`,
    };

    const inlineDataParts: InlineDataPart[] = images.map((image) => ({
      inlineData: {
        mimeType: 'image/png',
        data: image,
      },
    }));

    const parts = [textPart, ...inlineDataParts];

    const vertexResponse = await this._sendRequest(parts);

    const result = vertexResponse.candidates[0].content.parts
      .map((p: TextPart) => p.text || '')
      .join('');

    // >> Extract the percentage from the analysis result
    const percentageExcerpt = result.match(/Percentage match:\s*(\d+)%/);
    if (percentageExcerpt) {
      const percentage = parseInt(percentageExcerpt[1], 10);
      return {
        analysis: result,
        percentMatch: percentage,
      };
    }

    return {
      analysis: result,
    };
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
        'Failed to send request to Vertex AI. Please, try again later.',
      );
    }
  }
}

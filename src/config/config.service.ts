import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { EnvKeys } from './types';

@Injectable()
export class ConfigService {
  constructor() {
    config(); // >> Load .env file to process.env
  }

  private readonly logger = new Logger(ConfigService.name);

  public get(key: EnvKeys): string {
    const value = process.env[key];
    if (value === undefined) {
      const errMsg = `Missing ${key} environment variable.`;
      this.logger.error(errMsg);
      throw new Error(errMsg);
    }
    return value;
  }
}

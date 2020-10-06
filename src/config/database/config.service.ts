import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get dbURL(): string {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'dev'
    ) {
      return this.configService.get<string>('dbConfig.dbURL');
    } else {
      return this.configService.get<string>('dbConfig.testURL');
    }
  }
}

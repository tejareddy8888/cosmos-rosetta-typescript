import { Injectable } from '@nestjs/common';
import { AdapterLogger } from 'src/logger';

import { v5 as uuidv5 } from 'uuid';

import { ConfigService } from '../config';

@Injectable()
export class IndexerService {
  private readonly logger: AdapterLogger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new AdapterLogger(IndexerService.name);
  }
}

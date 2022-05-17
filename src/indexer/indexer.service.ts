import { Injectable } from '@nestjs/common';

import { v5 as uuidv5 } from 'uuid';

import { ConfigService } from '../config';

@Injectable()
export class IndexerService {
  constructor(private readonly configService: ConfigService) {}


}

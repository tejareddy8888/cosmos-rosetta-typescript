import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Injectable()
export class BlockService {
  constructor(private readonly configService: ConfigService) {}

  async getBlock() {
    return (await this.configService.stargateClient.getBlock()).id;
  }
}

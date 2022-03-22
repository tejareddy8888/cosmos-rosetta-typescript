import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Injectable()
export class BlockService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getBlock() {
    return (await this.configService.stargateClient.getBlock()).id;
  }
}

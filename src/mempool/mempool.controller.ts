import { Controller, Get } from '@nestjs/common';
import { MempoolService } from './mempool.service';

@Controller('/mempool')
export class MempoolController {
  constructor(private readonly mempoolService: MempoolService) {}

  @Get()
  getHello(): string {
    return this.mempoolService.getHello();
  }
}

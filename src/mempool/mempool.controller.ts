import { Controller, Post } from '@nestjs/common';
import { MempoolResponse, Error } from 'src/types';
import { MempoolService } from './mempool.service';

@Controller('/mempool')
export class MempoolController {
  constructor(private readonly mempoolService: MempoolService) {}

  @Post()
  async getMempoolTransaction(): Promise<MempoolResponse | Error> {
    return await this.mempoolService.getMempoolTransactions();
  }
}

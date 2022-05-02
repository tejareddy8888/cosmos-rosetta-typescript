import { Controller, Post, Body } from '@nestjs/common';
import { MempoolRequestDto, MempoolResponseDto } from 'src/types';
import { MempoolService } from './mempool.service';

@Controller('/mempool')
export class MempoolController {
  constructor(private readonly mempoolService: MempoolService) {}

  @Post()
  async getMempoolTransaction(
    @Body() request: MempoolRequestDto,
  ): Promise<MempoolResponseDto> {
    return await this.mempoolService.getMempoolTransactions(request);
  }
}

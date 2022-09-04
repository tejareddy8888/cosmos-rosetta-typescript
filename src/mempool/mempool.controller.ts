import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  MempoolResponse,
  Error,
  MempoolRequest,
  MempoolTransactionRequest,
  MempoolTransactionResponse,
} from 'src/types';
import { MempoolService } from './mempool.service';

@Controller('/mempool')
export class MempoolController {
  constructor(private readonly mempoolService: MempoolService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Returns the list of the transaction hashs in mempool and also saves the transaction hashes in the DB for example purposes',
    type: MempoolResponse,
  })
  async getMempool(
    @Body() request: MempoolRequest,
  ): Promise<MempoolResponse | Error> {
    return await this.mempoolService.getMempool(request);
  }

  @Post('/transaction')
  @ApiResponse({
    status: 200,
    description:
      'Returns the transaction details of the transaction in mempool',
    type: MempoolTransactionResponse,
  })
  async getMempoolTransaction(
    @Body() request: MempoolTransactionRequest,
  ): Promise<MempoolTransactionResponse | Error> {
    return await this.mempoolService.getMempoolTransaction(request);
  }
}

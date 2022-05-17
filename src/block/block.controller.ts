import { Body, Controller, Post } from '@nestjs/common';
import {
  BlockRequest,
  BlockResponse,
  BlockTransactionRequest,
  BlockTransactionResponse,
  Error,
} from '../types';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  async getBlock(
    @Body() request: BlockRequest,
  ): Promise<BlockResponse | Error> {
    return await this.blockService.getBlock(request);
  }

  @Post('/transaction')
  async getBlockTransaction(
    @Body() request: BlockTransactionRequest,
  ): Promise<BlockTransactionResponse | Error> {
    return await this.blockService.getBlockTransaction(request);
  }
}

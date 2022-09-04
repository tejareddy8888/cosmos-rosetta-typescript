import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'Returns the entire Block details',
    type: BlockResponse,
  })
  async getBlock(
    @Body() request: BlockRequest,
  ): Promise<BlockResponse | Error> {
    return await this.blockService.getBlock(request);
  }

  @Post('/transaction')
  @ApiResponse({
    status: 200,
    description:
      'fetches the Transaction from specified block in the Request of the input',
    type: BlockTransactionResponse,
  })
  async getBlockTransaction(
    @Body() request: BlockTransactionRequest,
  ): Promise<BlockTransactionResponse | Error> {
    return await this.blockService.getBlockTransaction(request);
  }
}

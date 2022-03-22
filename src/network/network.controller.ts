import { Body, Controller, Post } from '@nestjs/common';
import { JsonRpcSuccessResponse } from '@cosmjs/json-rpc';

import { NetworkService } from './network.service';
import {
  NetworkInfo,
  NetworkRequestDto,
  NetworkResponseDto,
  NetworkStatusRequestDto,
  NetworkStatusResponseDto,
} from '../types';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('list')
  getSupportedNetwork(
    @Body() request: NetworkRequestDto,
  ): Promise<NetworkResponseDto> {
    return this.networkService.getNetworkInfo(request);
  }

  @Post('status')
  getNetworkStatus(
    @Body() request: NetworkStatusRequestDto,
  ): Promise<NetworkStatusResponseDto> {
    return this.networkService.getNetworkStatus(request);
  }

  @Post('Currencies')
  async getCurrencies(@Body() request: NetworkInfo) {
    return this.networkService.getCurrencies(request);
  }
}

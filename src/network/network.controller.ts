import { Body, Controller, Post } from '@nestjs/common';

import { NetworkService } from './network.service';
import {
  Currency,
  MetadataRequest,
  NetworkRequest,
  NetworkListResponse,
  NetworkStatusResponse,
  NetworkOptionsResponse,
  Error,
} from '../types';
import { ApiResponse } from '@nestjs/swagger';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('list')
  @ApiResponse({
    status: 200,
    description: 'Returns the list of networks this Adapter supports',
    type: NetworkListResponse,
  })
  getSupportedNetwork(
    @Body() request: MetadataRequest,
  ): Promise<NetworkListResponse | Error> {
    return this.networkService.getNetworkInfo(request);
  }

  @Post('status')
  @ApiResponse({
    status: 200,
    description: 'Returns the status of the network specified',
    type: NetworkListResponse,
  })
  getNetworkStatus(
    @Body() request: NetworkRequest,
  ): Promise<NetworkStatusResponse | Error> {
    return this.networkService.getNetworkStatus(request);
  }

  @Post('currencies')
  @ApiResponse({
    status: 200,
    description: 'Returns the currencies used on the network specified',
    type: NetworkListResponse,
  })
  async getCurrencies(
    @Body() request: NetworkRequest,
  ): Promise<Currency | Error> {
    return this.networkService.getCurrencies(request);
  }

  @Post('options')
  @ApiResponse({
    status: 200,
    description:
      'Returns the additional network options needed for the specified network',
    type: NetworkListResponse,
  })
  async getOptions(
    @Body() request: NetworkRequest,
  ): Promise<NetworkOptionsResponse | Error> {
    return this.networkService.getOptions(request);
  }
}

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

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('list')
  getSupportedNetwork(
    @Body() request: MetadataRequest,
  ): Promise<NetworkListResponse | Error> {
    return this.networkService.getNetworkInfo(request);
  }

  @Post('status')
  getNetworkStatus(
    @Body() request: NetworkRequest,
  ): Promise<NetworkStatusResponse | Error> {
    return this.networkService.getNetworkStatus(request);
  }

  @Post('currencies')
  async getCurrencies(
    @Body() request: NetworkRequest,
  ): Promise<Currency | Error> {
    return this.networkService.getCurrencies(request);
  }

  @Post('options')
  async getOptions(
    @Body() request: NetworkRequest,
  ): Promise<NetworkOptionsResponse | Error> {
    return this.networkService.getOptions(request);
  }
}

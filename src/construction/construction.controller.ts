import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ConstructionDeriveRequest,
  ConstructionDeriveResponse,
  ConstructionPayloadsRequest,
  ConstructionPayloadsResponse,
  ConstructionCombineRequest,
  ConstructionCombineResponse,
  ConstructionHashRequest,
  ConstructionSubmitRequest,
  TransactionIdentifier,
  Error,
} from 'src/types';
import { ConstructionService } from './construction.service';

@Controller('/construction')
export class ConstructionController {
  constructor(private readonly constructionService: ConstructionService) {}

  @Post('derive')
  @ApiResponse({
    status: 200,
    description:
      'This call derives address out of the PublicKey HexBytes and PublicKey CurveType ',
    type: ConstructionDeriveResponse,
  })
  async createAccount(
    @Body() request: ConstructionDeriveRequest,
  ): Promise<ConstructionDeriveResponse | Error> {
    return await this.constructionService.createAccount(request);
  }

  // @Post('metadata')
  // metadata(): Error {
  //   return this.constructionService.metadata();
  // }

  // @Post('preprocess')
  // preprocess(): Error {
  //   return this.constructionService.preprocess();
  // }

  // @Post('parse')
  // async parse(): Promise<Error> {
  //   return await this.constructionService.parse();
  // }

  @Post('payloads')
  @ApiResponse({
    status: 200,
    description:
      'This call builds the unsigned transaction out of the operation data given',
    type: ConstructionCombineResponse,
  })
  payloads(
    @Body() request: ConstructionPayloadsRequest,
  ): ConstructionPayloadsResponse | Error {
    return this.constructionService.payload(request);
  }

  @Post('combine')
  @ApiResponse({
    status: 200,
    description:
      'This call combines the unsigned transaction and the signature',
    type: ConstructionCombineResponse,
  })
  async combine(
    @Body() request: ConstructionCombineRequest,
  ): Promise<ConstructionCombineResponse | Error> {
    return await this.constructionService.combine(request);
  }

  @Post('hash')
  @ApiResponse({
    status: 200,
    description:
      'This call provides the expected transaction hash using signed transaction as input',
    type: TransactionIdentifier,
  })
  hash(
    @Body() request: ConstructionHashRequest,
  ): TransactionIdentifier | Error {
    return this.constructionService.hash(request);
  }

  @Post('submit')
  @ApiResponse({
    status: 200,
    description: 'This call submit the transaction to the network',
    type: TransactionIdentifier,
  })
  async submit(
    @Body() request: ConstructionSubmitRequest,
  ): Promise<TransactionIdentifier | Error> {
    return await this.constructionService.submit(request);
  }
}

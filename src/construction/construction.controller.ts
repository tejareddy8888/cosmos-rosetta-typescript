import { Controller, Post, Body } from '@nestjs/common';
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
  async createAccount(
    @Body() request: ConstructionDeriveRequest,
  ): Promise<ConstructionDeriveResponse | Error> {
    return await this.constructionService.createAccount(request);
  }

  @Post('metadata')
  metadata(): Error {
    return this.constructionService.metadata();
  }

  @Post('preprocess')
  preprocess(): Error {
    return this.constructionService.preprocess();
  }

  @Post('parse')
  async parse(): Promise<Error> {
    return await this.constructionService.parse();
  }

  @Post('payloads')
  payloads(
    @Body() request: ConstructionPayloadsRequest,
  ): ConstructionPayloadsResponse | Error {
    return this.constructionService.payload(request);
  }

  @Post('combine')
  async combine(
    @Body() request: ConstructionCombineRequest,
  ): Promise<ConstructionCombineResponse | Error> {
    return await this.constructionService.combine(request);
  }

  @Post('hash')
  hash(
    @Body() request: ConstructionHashRequest,
  ): TransactionIdentifier | Error {
    return this.constructionService.hash(request);
  }

  @Post('submit')
  async submit(
    @Body() request: ConstructionSubmitRequest,
  ): Promise<TransactionIdentifier | Error> {
    return await this.constructionService.submit(request);
  }
}

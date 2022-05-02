import { Controller, Post, Body } from '@nestjs/common';
import { CreateAccountRequestDto, CreateAccountResponseDto } from 'src/types';
import { ConstructionService } from './construction.service';

@Controller('/construction')
export class ConstructionController {
  constructor(private readonly constructionService: ConstructionService) {}

  @Post('derive')
  async createAccount(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }

  @Post('combine')
  async combine(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }

  @Post('hash')
  async hash(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }

  @Post('metadata')
  async metadata(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }

  @Post('parse')
  async parse(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }

  @Post('payloads')
  async payloads(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }

  @Post('preprocess')
  async preprocess(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }

  @Post('submit')
  async submit(
    @Body() request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    return await this.constructionService.createAccount(request);
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';

import { AccountService } from './account.service';
import { AccountBalanceRequestDto, AccountBalanceResponsetDto } from '../types';

class AddressBody {
  address: string;
}
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getHello(): string {
    return this.accountService.getHello();
  }

  @Post('balance')
  async getBalance(
    @Body() request: AccountBalanceRequestDto,
  ): Promise<AccountBalanceResponsetDto> {
    return this.accountService.getBalances(request);
  }
}

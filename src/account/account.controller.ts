import { Controller, Post, Body } from '@nestjs/common';

import { AccountService } from './account.service';
import { AccountBalanceRequest, AccountBalanceResponse, Error } from '../types';
import { ApiResponse } from '@nestjs/swagger';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('balance')
  @ApiResponse({
    status: 200,
    description: 'Returns the Account Balance of the Address mentioned',
    type: AccountBalanceResponse,
  })
  async getBalance(
    @Body() request: AccountBalanceRequest,
  ): Promise<AccountBalanceResponse | Error> {
    return this.accountService.getBalances(request);
  }

  // @Post('coins')
  // async getCoins(
  //   @Body() request: AccountBalanceRequest,
  // ): Promise<AccountBalanceResponse | Error> {
  //   return this.accountService.getCoins(request);
  // }
}

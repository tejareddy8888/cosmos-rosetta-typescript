import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config';
import { AccountBalanceRequestDto, AccountBalanceResponsetDto } from '../types';

@Injectable()
export class AccountService {
  constructor(private readonly configService: ConfigService) {}

  async getBalances(
    request: AccountBalanceRequestDto,
  ): Promise<AccountBalanceResponsetDto> {
    switch (request.blockchain) {
      case 'cosmoshub-4': {
        const [blockHeight, block, balance] = await Promise.all([
          this.configService.stargateClient.getHeight(),
          this.configService.stargateClient.getBlock(),
          this.configService.cosmosReader?.bank.allBalances(
            request.account_identifier.address,
          ),
        ]);
        return {
          block_identifier: {
            index: blockHeight.toString(),
            hash: block.id,
          },
          balances: [
            { value: balance[0].amount, currency: request.currencies[0] },
          ],
        } as AccountBalanceResponsetDto;
      }
      default: {
        throw new Error(`unspported network ${request.blockchain}`);
      }
    }
  }
}

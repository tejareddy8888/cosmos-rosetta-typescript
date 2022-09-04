import { Injectable } from '@nestjs/common';
import { AdapterLogger } from 'src/logger';

import { ConfigService } from '../config';
import { AccountBalanceRequest, AccountBalanceResponse, Error } from '../types';

@Injectable()
export class AccountService {
  private readonly logger: AdapterLogger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new AdapterLogger(AccountService.name);
  }

  async getBalances(
    request: AccountBalanceRequest,
  ): Promise<AccountBalanceResponse | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const [blockHeight, block, balances] = await Promise.all([
          this.configService.stargateClient.getHeight(),
          this.configService.stargateClient.getBlock(),
          this.configService.cosmosReader?.bank.allBalances(
            request.account_identifier.address,
          ),
        ]);
        const balance = balances.find(
          (balance) =>
            balance.denom.toLowerCase() === request.currencies[0].symbol,
        );
        return {
          block_identifier: {
            index: blockHeight,
            hash: block.id,
          },
          balances: [
            {
              value: balance.amount,
              Currency: request.currencies[0],
            },
          ],
        } as AccountBalanceResponse;
      }
      default: {
        return {
          code: 404,
          message: `unspported network ${request.network_identifier}`,
          retriable: false,
        };
      }
    }
  }

  getCoins(request: AccountBalanceRequest): AccountBalanceResponse | Error {
    return {
      code: 404,
      message:
        'As this adapter currently does not provide any support for UTXOs, this call is not supported',
      retriable: false,
    };
  }
}

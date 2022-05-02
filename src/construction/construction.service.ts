import { Injectable } from '@nestjs/common';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

import { CreateAccountRequestDto, CreateAccountResponseDto } from 'src/types';

@Injectable()
export class ConstructionService {
  async createAccount(
    request: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    switch (request.blockchain) {
      case 'cosmoshub-4': {
        if (
          request.public_key &&
          request.public_key.hex_bytes !== 'string' &&
          request.public_key.curve_type !== 'secp256k1'
        ) {
          throw new Error(
            `unspported network ${request.blockchain} for cosmos`,
          );
        }
        const wallet = await DirectSecp256k1HdWallet.generate(12, {
          prefix: 'cosmos',
        });

        const account = (await wallet.getAccounts())[0];

        return {
          address: 'string',
          account_identifier: {
            address: account.address,
          },
        };
      }
      default: {
        throw new Error(`unspported network ${request.blockchain}`);
      }
    }
  }
}

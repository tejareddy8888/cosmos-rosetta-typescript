import { Injectable } from '@nestjs/common';
import { fromBase64, toHex } from '@cosmjs/encoding';
import { sha256 } from '@cosmjs/crypto';
import { MempoolRequestDto, MempoolResponseDto, Transaction } from '../types';

import { ConfigService } from '../config';

@Injectable()
export class MempoolService {
  constructor(private readonly configService: ConfigService) {}

  async getMempoolTransactions(
    request: MempoolRequestDto,
  ): Promise<MempoolResponseDto> {
    switch (request.blockchain) {
      case 'cosmoshub-4': {
        const mempool_transactions_response =
          await this.configService.httpClient.execute({
            id: '-1',
            jsonrpc: '2.0',
            method: 'unconfirmed_txs',
            params: [request.limit ? request.limit : '10'],
          });

        // decoding the transaction body needs such mechanism
        //console.log(
        //       Buffer.from(
        //         fromBase64(mempool_transactions_response.result.txs[0]),
        //       ),
        // );

        if (mempool_transactions_response.result) {
          return {
            transaction_identifiers:
              mempool_transactions_response.result.txs.map(
                (decodedString: string) => {
                  return { hash: decodedString } as Transaction;
                },
              ),
          };
        }
      }
      default: {
        throw new Error(`unspported network ${request.blockchain}`);
      }
    }
  }
}

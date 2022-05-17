import { Injectable } from '@nestjs/common';

import { MempoolResponse, Error } from '../types';

import { ConfigService } from '../config';

@Injectable()
export class MempoolService {
  constructor(private readonly configService: ConfigService) {}

  async getMempoolTransactions(): Promise<MempoolResponse | Error> {
    const mempool_transactions_response =
      await this.configService.httpClient.execute({
        id: '-1',
        jsonrpc: '2.0',
        method: 'unconfirmed_txs',
        params: ['3'],
      });

    if (mempool_transactions_response.result) {
      return {
        transaction_identifiers: await Promise.all(
          mempool_transactions_response.result.txs.map(async (tx: string) => {
            const actived = await this.configService.cosmosDecodeTx(tx);
            await this.configService.createAndSaveEntry(
              actived.transaction_identifier.hash,
              'cosmos',
            );
            return await (
              await this.configService.cosmosDecodeTx(tx)
            )?.transaction_identifier;
          }),
        ),
      };
    } else {
      return {
        code: 500,
        message: `empty mempool `,
        retriable: false,
      };
    }
  }
}

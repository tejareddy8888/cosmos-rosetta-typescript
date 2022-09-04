import { Injectable } from '@nestjs/common';
import { decodeTxRaw } from '@cosmjs/proto-signing';

import {
  MempoolRequest,
  MempoolResponse,
  Error,
  MempoolTransactionRequest,
  MempoolTransactionResponse,
} from '../types';

import { ConfigService } from '../config';
import { AdapterLogger } from 'src/logger';

@Injectable()
export class MempoolService {
  private readonly logger: AdapterLogger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new AdapterLogger(MempoolService.name);
  }

  async getMempool(request: MempoolRequest): Promise<MempoolResponse | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const mempool_transactions_response =
          await this.configService.httpClient.execute({
            id: '-1',
            jsonrpc: '2.0',
            method: 'unconfirmed_txs',
            params: ['10'],
          });

        if (mempool_transactions_response.result) {
          return {
            transaction_identifiers: await Promise.all(
              mempool_transactions_response.result.txs.map(
                async (tx: string) => {
                  const actived = await this.configService.cosmosDecodeTx(tx);
                  await this.configService.createAndSaveEntry(
                    actived.transaction_identifier.hash,
                    'cosmos',
                  );
                  return await (
                    await this.configService.cosmosDecodeTx(tx)
                  )?.transaction_identifier;
                },
              ),
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
      default: {
        return {
          code: 500,
          message: `unsupported network `,
          retriable: false,
        };
      }
    }
  }

  async getMempoolTransaction(
    request: MempoolTransactionRequest,
  ): Promise<MempoolTransactionResponse | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const rawTx = await this.configService.stargateClient.getTx(
          request.transaction_identifier.hash,
        );

        const decoded = decodeTxRaw(rawTx.tx);

        return {
          transaction: {
            transaction_identifier: {
              hash: request.transaction_identifier.hash,
            },
            operations: [
              {
                operation_identifier: { index: rawTx.height.toString() },
                type: decoded.body.messages[0].typeUrl,
              },
            ],
          },
        };
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
}

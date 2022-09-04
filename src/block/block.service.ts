import { Injectable } from '@nestjs/common';
import { decodeTxRaw } from '@cosmjs/proto-signing';

import {
  BlockRequest,
  BlockTransactionRequest,
  BlockResponse,
  BlockTransactionResponse,
  Transaction,
  Error,
} from 'src/types';

import { ConfigService } from '../config/config.service';
import { AdapterLogger } from 'src/logger';

@Injectable()
export class BlockService {
  private readonly logger: AdapterLogger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new AdapterLogger(BlockService.name);
  }

  async getBlock(request: BlockRequest): Promise<BlockResponse | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const [latestBlock, latestBlockHeight] = await Promise.all([
          this.configService.stargateClient.getBlock(
            request.block_identifier?.index ?? undefined,
          ),
          this.configService.stargateClient.getHeight(),
        ]);

        const fetchedBlockResponse =
          await this.configService.httpClient.execute({
            id: '-1',
            jsonrpc: '2.0',
            method: 'block',
            params: [latestBlockHeight.toString()],
          });

        const fetchedTx = await Promise.all(
          fetchedBlockResponse.result.block.data.txs
            .slice(0, 5)
            .map(async (eachTx) => {
              const yes = await this.configService.cosmosDecodeTx(eachTx);
              console.log(yes);
              return yes;
            }),
        );

        return {
          block: {
            block_identifier: {
              index: parseInt(latestBlock.id),
              hash: fetchedBlockResponse.result.block_id.hash,
            },
            parent_block_identifier: {
              index: parseInt(latestBlock.id) - 1,
              hash: fetchedBlockResponse.result.block.header.last_block_id.hash,
            },
            timestamp: new Date(
              fetchedBlockResponse.result.block.time,
            ).getTime(),
            transactions: fetchedTx,
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

  async getBlockTransaction(
    request: BlockTransactionRequest,
  ): Promise<BlockTransactionResponse | Error> {
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

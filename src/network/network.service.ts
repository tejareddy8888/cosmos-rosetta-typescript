import { Injectable } from '@nestjs/common';
import { JsonRpcSuccessResponse } from '@cosmjs/json-rpc';

import { ConfigService } from '../config/config.service';
import {
  BlockIdentifier,
  Currency,
  NetworkInfo,
  NetworkRequestDto,
  NetworkResponseDto,
  NetworkStatusRequestDto,
  NetworkStatusResponseDto,
} from '../types';

@Injectable()
export class NetworkService {
  constructor(private readonly configService: ConfigService) {}

  async getSupportedNetwork(): Promise<JsonRpcSuccessResponse> {
    return await this.configService.httpClient.execute({
      id: '-1',
      jsonrpc: '2.0',
      method: 'status',
      params: [],
    });
  }

  async getNetworkInfo(
    request: NetworkRequestDto,
  ): Promise<NetworkResponseDto> {
    const [networkResponse, abciResponse] = await Promise.all([
      this.configService.httpClient.execute({
        id: '-1',
        jsonrpc: '2.0',
        method: 'net_info',
        params: [],
      }),
      await this.configService.httpClient.execute({
        id: '-1',
        jsonrpc: '2.0',
        method: 'abci_info',
        params: [],
      }),
    ]);

    if (networkResponse.result && abciResponse.result) {
      return {
        network_identifiers: [
          {
            blockchain: networkResponse.result.peers[0].node_info.network,
            network: abciResponse.result.response.data,
          },
        ],
      };
    }
    return {
      network_identifiers: [
        {
          blockchain: 'cosmos',
          network: 'mainnet',
        },
      ],
    };
  }

  async getNetworkStatus(
    request: NetworkStatusRequestDto,
  ): Promise<NetworkStatusResponseDto> {
    switch (request.blockchain) {
      case 'cosmoshub-4': {
        const [statusCallResponse, networkInfoResponse] = await Promise.all([
          this.configService.httpClient.execute({
            id: '-1',
            jsonrpc: '2.0',
            method: 'status',
            params: [],
          }),
          this.configService.httpClient.execute({
            id: '-1',
            jsonrpc: '2.0',
            method: 'net_info',
            params: [],
          }),
        ]);

        const { sync_info, node_info, _ } = statusCallResponse.result;
        const genesis_block_identifier: BlockIdentifier = {
          index: sync_info.earliest_block_height,
          hash: sync_info.earliest_block_hash,
        };
        const Response: NetworkStatusResponseDto = {
          current_block_identifier: {
            index: sync_info.latest_block_height,
            hash: sync_info.latest_block_hash,
          },
          current_block_timestamp: new Date(
            sync_info.latest_block_time,
          ).getTime(),
          genesis_block_identifier,
          oldest_block_identifier: genesis_block_identifier,
          sync_status: {
            synced: Boolean(!sync_info.catching_up),
          },
          peers: [
            {
              peer_id: networkInfoResponse.result.peers[0].node_info.id,
            },
          ],
        };
        return Response;
      }

      default: {
        throw new Error(`unspported network ${request.blockchain}`);
      }
    }
  }

  async getCurrencies(request: NetworkInfo): Promise<Currency> {
    switch (request.blockchain) {
      case 'cosmoshub-4': {
        const denomMetadata =
          await this.configService.cosmosReader.bank.denomsMetadata();

        return {
          symbol: denomMetadata[0].base,
          decimals: denomMetadata[0].denomUnits
            .find((each) => each.denom === 'atom')
            .exponent.toString(),
        };
      }
      default: {
        throw new Error(`unspported network ${request.blockchain}`);
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { JsonRpcSuccessResponse } from '@cosmjs/json-rpc';

import { ConfigService } from '../config';
import {
  BlockIdentifier,
  Currency,
  MetadataRequest,
  NetworkRequest,
  NetworkListResponse,
  NetworkStatusResponse,
  NetworkOptionsResponse,
  Error,
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

  async getNetworkInfo(request: MetadataRequest): Promise<NetworkListResponse> {
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
    request: NetworkRequest,
  ): Promise<NetworkStatusResponse | Error> {
    switch (request.network_identifier.blockchain) {
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

        const { sync_info, _ } = statusCallResponse.result;
        const genesis_block_identifier: BlockIdentifier = {
          index: sync_info.earliest_block_height,
          hash: sync_info.earliest_block_hash,
        };
        const Response: NetworkStatusResponse = {
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
        return {
          code: 404,
          message: 'unsupported action',
          retriable: false,
        };
      }
    }
  }

  async getCurrencies(request: NetworkRequest): Promise<Currency | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const denomMetadata =
          await this.configService.cosmosReader.bank.denomsMetadata();

        return {
          symbol: denomMetadata[0].base,
          decimals: denomMetadata[0].denomUnits.find(
            (each) => each.denom === 'atom',
          ).exponent,
        };
      }
      default: {
        return {
          code: 404,
          message: 'unsupported action',
          retriable: false,
        };
      }
    }
  }

  async getOptions(
    request: NetworkRequest,
  ): Promise<NetworkOptionsResponse | Error> {
    const rosetta_version = '1.4.12';
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const networkInfoResponse = await this.configService.httpClient.execute(
          {
            id: '-1',
            jsonrpc: '2.0',
            method: 'net_info',
            params: [],
          },
        );

        return {
          version: {
            rosetta_version,
            node_version: networkInfoResponse.result.peers[0].node_info.version,
          },
          allow: {
            operation_statuses: [],
            operation_types: [],
            errors: [],
            historical_balance_lookup: false,
            call_methods: [],
            balance_exemptions: [],
            mempool_coins: true,
          },
        };
      }

      default: {
        return {
          code: 404,
          message: 'unsupported action',
          retriable: false,
        };
      }
    }
  }
}

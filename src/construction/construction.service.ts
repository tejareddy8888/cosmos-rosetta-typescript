import { Injectable } from '@nestjs/common';
import {
  makeSignDoc,
  Secp256k1Wallet,
  serializeSignDoc,
  rawSecp256k1PubkeyToRawAddress,
  rawEd25519PubkeyToRawAddress,
} from '@cosmjs/amino';
import { coin } from '@cosmjs/stargate';
import {
  DirectSecp256k1HdWallet,
  makeSignBytes,
  EncodeObject,
} from '@cosmjs/proto-signing';
import { AminoTypes, Account } from '@cosmjs/stargate';
import { toBech32 } from '@cosmjs/encoding';

import {
  ConstructionDeriveRequest,
  ConstructionDeriveResponse,
  ConstructionHashRequest,
  ConstructionSubmitRequest,
  TransactionIdentifier,
  Error,
  ConstructionCombineRequest,
  ConstructionCombineResponse,
  ConstructionPayloadsRequest,
  ConstructionPayloadsResponse,
} from 'src/types';
import { ConfigService } from '../config';
import { AdapterLogger } from '../logger';

const aminoTypes = new AminoTypes({ prefix: 'cosmos' });

@Injectable()
export class ConstructionService {
  private readonly logger: AdapterLogger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new AdapterLogger(ConstructionService.name);
  }
  async createAccount(
    request: ConstructionDeriveRequest,
  ): Promise<ConstructionDeriveResponse | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        if (
          request.public_key &&
          (request.public_key.curve_type == 'secp256r1' ||
            request.public_key.curve_type == 'tweedle')
        ) {
          return {
            code: 404,
            message: `unspported key algorithm ${request.public_key.curve_type} for cosmos`,
            retriable: false,
          };
        }

        if (request.public_key.curve_type === 'secp256k1') {
          const address = toBech32(
            'cosmos',
            rawSecp256k1PubkeyToRawAddress(
              Buffer.from(request.public_key.hex_bytes),
            ),
          );
          return {
            address,
            account_identifier: {
              address,
            },
          };
        }

        if (request.public_key.curve_type === 'edwards25519') {
          const address = toBech32(
            'cosmos',
            rawEd25519PubkeyToRawAddress(
              Buffer.from(request.public_key.hex_bytes),
            ),
          );
          return {
            address,
            account_identifier: {
              address,
            },
          };
        }
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

  // preprocess(): Error {
  //   return {
  //     code: 404,
  //     message: `unspported operations for cosmos`,
  //     retriable: false,
  //   };
  // }
  // metadata() {
  //   return {
  //     code: 404,
  //     message: `unspported operations for cosmos`,
  //     retriable: false,
  //   };
  // }

  //directSecp256k1Wallet MakeSignDoc or MakeSignBytes, step 1 for creating unsigned payloads
  payload(request: ConstructionPayloadsRequest): ConstructionPayloadsResponse {
    const txBody = {
      typeUrl: request.operations[0].type,
      value: {
        fromAddress: request.operations[0].account.address,
        toAddress: '',
        amount: request.operations[0].amount.value,
      },
    } as EncodeObject;

    return { unsigned_transaction: JSON.stringify(txBody), payloads: [] };
  }

  // //SigningStargateClient, simulate, step 2 for creating unsigned payloads
  // parse() {
  //   // As cosmos needs signing object to simulate the transaction to check the correctnesss, this was not implemented
  //   return {
  //     code: 404,
  //     message: `unspported operations for cosmos`,
  //     retriable: false,
  //   };
  // }

  // SigningStargateClient, sign using the signerData
  async combine(
    request: ConstructionCombineRequest,
  ): Promise<ConstructionCombineResponse | Error> {
    // PubKey, sequence, feeAmount, txType, value, accountNumber: number
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const unsigned_transaction = JSON.parse(request.unsigned_transaction);
        const signed_transaction = JSON.stringify({
          signed: unsigned_transaction,
          signature: request.signatures,
        });

        return {
          signed_transaction,
        };
      }
      default: {
        return {
          code: 404,
          message: `unspported operations for cosmos`,
          retriable: false,
        };
      }
    }
  }

  // not possible
  hash(request: ConstructionHashRequest): TransactionIdentifier | Error {
    // As cosmos transaction hash determination is not possible before transaction submission. So this is not supported
    return {
      hash: this.configService.toCosmosTxHashFromUint8(
        new TextEncoder().encode(request.signed_transaction),
      ),
    };
  }

  // SigningStargateClient, broadcastTx
  async submit(
    request: ConstructionSubmitRequest,
  ): Promise<TransactionIdentifier | Error> {
    const txResponse = await this.configService.stargateClient.broadcastTx(
      new TextEncoder().encode(request.signed_transaction),
    );
    return { hash: txResponse.transactionHash };
  }
}

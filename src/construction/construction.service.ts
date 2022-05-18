import { Injectable } from '@nestjs/common';
import { makeSignDoc, Secp256k1Wallet, serializeSignDoc } from '@cosmjs/amino';
import { coin } from '@cosmjs/stargate';
import {
  DirectSecp256k1HdWallet,
  makeSignBytes,
  EncodeObject,
} from '@cosmjs/proto-signing';
import { AminoTypes, Account } from '@cosmjs/stargate';

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
import { ConfigService } from 'src/config';
import { AminoMsg } from '@cosmjs/stargate/node_modules/@cosmjs/amino';

const aminoTypes = new AminoTypes({ prefix: 'cosmos' });

@Injectable()
export class ConstructionService {
  constructor(private configService: ConfigService) {}
  async createAccount(
    request: ConstructionDeriveRequest,
  ): Promise<ConstructionDeriveResponse | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        if (
          request.public_key &&
          request.public_key.hex_bytes !== 'string' &&
          request.public_key.curve_type !== 'secp256k1'
        ) {
          return {
            code: 404,
            message: `unspported key algorithm ${request.public_key.curve_type} for cosmos`,
            retriable: false,
          };
        }
        const wallet = await DirectSecp256k1HdWallet.generate(12, {
          prefix: 'cosmos',
        });

        const account = (await wallet.getAccounts())[0];

        return {
          address: account.address,
          account_identifier: {
            address: account.address,
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

  preprocess(): Error {
    return {
      code: 404,
      message: `unspported operations for cosmos`,
      retriable: false,
    };
  }
  metadata() {
    return {
      code: 404,
      message: `unspported operations for cosmos`,
      retriable: false,
    };
  }

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

  //SigningStargateClient, simulate, step 2 for creating unsigned payloads
  parse() {
    // As cosmos needs signing object to simulate the transaction to check the correctnesss, this was not implemented
    return {
      code: 404,
      message: `unspported operations for cosmos`,
      retriable: false,
    };
  }

  // SigningStargateClient, sign using the signerData
  async combine(
    request: ConstructionCombineRequest,
  ): Promise<ConstructionCombineResponse | Error> {
    // PubKey, sequence, feeAmount, txType, value, accountNumber: number
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const amino = aminoTypes.toAmino(
          JSON.parse(request.unsigned_transaction),
        );
        const fee = { amount: [coin('2500', 'uatom')], gas: '1000000' };

        const chainId = 'cosmoshub-4';
        const account = await this.configService.stargateClient.getAccount(
          'cosmos1hfml4tzwlc3mvynsg6vtgywyx00wfkhrtpkx6t',
        );

        console.log(account);

        const signDoc = makeSignDoc(
          [amino],
          fee,
          chainId,
          '',
          account.accountNumber,
          account.sequence,
        );

        const client = await Secp256k1Wallet.fromKey(
          new TextEncoder().encode(request.signatures[0].hex_bytes),
        );

        const signedResponse = await client.signAmino(
          request.signatures[0].signing_payload.address!,
          signDoc,
        );

        return {
          signed_transaction: new TextDecoder().decode(
            serializeSignDoc(signedResponse.signed),
          ),
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

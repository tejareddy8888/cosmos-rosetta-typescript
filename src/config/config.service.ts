import { Injectable, OnModuleInit } from '@nestjs/common';
import { Tendermint34Client, HttpClient } from '@cosmjs/tendermint-rpc';
import { sha256 } from '@cosmjs/crypto';
import { fromBase64, toHex } from '@cosmjs/encoding';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

import { TransactionEntity } from '../entities';
import {
  AuthExtension,
  QueryClient,
  BankExtension,
  DistributionExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupStakingExtension,
  StakingExtension,
  IbcExtension,
  MintExtension,
  setupAuthExtension,
  setupGovExtension,
  setupIbcExtension,
  setupMintExtension,
  setupTxExtension,
  StargateClient,
  TxExtension,
  SigningStargateClient,
} from '@cosmjs/stargate';
import { Transaction } from 'src/types';

type CosmosReaderClient = QueryClient &
  AuthExtension &
  BankExtension &
  DistributionExtension &
  StakingExtension &
  IbcExtension &
  MintExtension &
  TxExtension;

dotenv.config();

@Injectable()
export class ConfigService implements OnModuleInit {
  cosmosReader: CosmosReaderClient;
  stargateClient: StargateClient;
  httpClient: HttpClient;
  private rpcUri: string;
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {
    this.rpcUri = process.env.COSMOS_RPC_URL;
  }

  onModuleInit() {
    console.log(this.rpcUri);
    this.setupQueryClient();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async setupQueryClient() {
    const tendermintClient = await this.getTendermintClient(this.rpcUri);
    this.cosmosReader = QueryClient.withExtensions(
      tendermintClient,
      setupAuthExtension,
      setupBankExtension,
      setupDistributionExtension,
      setupGovExtension,
      setupIbcExtension,
      setupMintExtension,
      setupStakingExtension,
      setupTxExtension,
    );
    this.stargateClient = await StargateClient.connect(this.rpcUri);
    this.httpClient = new HttpClient(this.rpcUri);
  }

  async getBalances(address: string) {
    const balance = await this.cosmosReader!.bank.balance(address, 'uatom');
    return { amount: balance?.amount };
  }

  private async getTendermintClient(rpcURL: string) {
    return await Tendermint34Client.create(new HttpClient(rpcURL));
  }

  toCosmosTxHashFromBase64(base64EncodedTx: string) {
    return toHex(sha256(fromBase64(base64EncodedTx)));
  }

  toCosmosTxHashFromUint8(Uint8Tx: Uint8Array) {
    return toHex(sha256(Uint8Tx));
  }

  async createAndSaveEntry(transactionHash: string, network: string) {
    const transactionEntry = this.transactionRepository.create();
    transactionEntry.transactionHash = transactionHash;
    transactionEntry.chain = network;
    transactionEntry.id = parseInt(
      Math.floor(Math.random() * 100000).toString(),
    );
    await this.transactionRepository.save(transactionEntry);
  }

  async cosmosDecodeTx(tx: string): Promise<Transaction> {
    const txHash = this.toCosmosTxHashFromBase64(tx);
    try {
      const txDetails = await this.stargateClient.getTx(txHash);
      const decoded = decodeTxRaw(txDetails.tx);
      return {
        transaction_identifier: { hash: txHash },
        operations: [
          {
            operation_identifier: { index: txDetails.height.toString() },
            type: decoded.body.messages[0].typeUrl,
          },
        ],
      };
    } catch {
      return { transaction_identifier: { hash: txHash }, operations: [] };
    }
  }
}

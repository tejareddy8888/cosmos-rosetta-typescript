import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Tendermint34Client, HttpClient } from '@cosmjs/tendermint-rpc';
import * as dotenv from 'dotenv';
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
  SigningStargateClient,
  TxExtension,
} from '@cosmjs/stargate';

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
  constructor() {
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
}

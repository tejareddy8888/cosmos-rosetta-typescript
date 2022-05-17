import { ApiProperty } from '@nestjs/swagger';

export enum Network {
  cosmos = 'cosmos',
}

export class Error {
  @ApiProperty({ type: 'number' })
  code: number;
  @ApiProperty({ type: 'string' })
  message: string;
  @ApiProperty({ type: 'string' })
  description?: string;
  @ApiProperty({ type: 'boolean' })
  retriable: boolean;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  details?: {
    message: string;
  };
}

export class SubNetworkIdentifier {
  @ApiProperty({ type: 'string' })
  network: string;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class NetworkIdentifier {
  @ApiProperty({ type: 'string' })
  blockchain: string;
  @ApiProperty({ type: 'string' })
  network: string;
  @ApiProperty({ type: SubNetworkIdentifier })
  sub_network_identifier?: SubNetworkIdentifier;
}

export class SubAccountIdentifier {
  @ApiProperty({ type: 'string' })
  address: string;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class AccountIdentifier {
  @ApiProperty({ type: 'string' })
  address: string;
  @ApiProperty({ type: SubAccountIdentifier })
  sub_account?: SubAccountIdentifier;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: {
    chain_code?: string;
  };
}

export class PartialBlockIdentifier {
  @ApiProperty({ type: 'number' })
  index?: number;
  @ApiProperty({ type: 'string' })
  hash?: string;
}

export class Currency {
  @ApiProperty({ type: 'string' })
  symbol: string;
  @ApiProperty({ type: 'number' })
  decimals: number;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: any;
}

export class AccountBalanceRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: AccountIdentifier })
  account_identifier: AccountIdentifier;
  @ApiProperty({ type: PartialBlockIdentifier })
  block_identifier?: PartialBlockIdentifier;
  @ApiProperty({ type: Currency })
  currencies?: Currency[];
}

export class BlockIdentifier {
  @ApiProperty({ type: 'number' })
  index: number;
  @ApiProperty({ type: 'string' })
  hash: string;
}

export class Amount {
  @ApiProperty({ type: 'string' })
  value: string;
  @ApiProperty({ type: Currency })
  Currency: Currency;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class AccountBalanceResponse {
  @ApiProperty({ type: BlockIdentifier })
  block_identifier: BlockIdentifier;
  @ApiProperty({ type: [Amount] })
  balances: Amount[];
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class AccountCoinsRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: AccountIdentifier })
  account_identifier: AccountIdentifier;
  @ApiProperty({ type: 'boolean' })
  include_mempool?: boolean;
  @ApiProperty({ type: [Currency] })
  currencies?: Currency[];
}

export class CoinIdentifier {
  @ApiProperty({ type: 'string' })
  identifier: string;
}
export class Coin {
  @ApiProperty({ type: CoinIdentifier })
  coin_identifier: CoinIdentifier;
  @ApiProperty({ type: Amount })
  amount: Amount;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: {
    [name: string]: TokenBundleItem[];
  };
}

export class AccountCoinsResponse {
  @ApiProperty({ type: BlockIdentifier })
  block_identifier: BlockIdentifier;
  @ApiProperty({ type: [Coin] })
  coins: Coin[];
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export declare type Timestamp = number;

export class TransactionIdentifier {
  @ApiProperty({ type: 'string' })
  hash: string;
}

export class RelatedTransaction {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier?: NetworkIdentifier;
  @ApiProperty({ type: TransactionIdentifier })
  transaction_identifier: TransactionIdentifier;
  @ApiProperty({ type: 'string' })
  direction: Direction;
}

export class OperationIdentifier {
  @ApiProperty({ type: 'string' })
  index: string;
  @ApiProperty({ type: 'number' })
  network_index?: number;
}

export class CoinChange {
  @ApiProperty({ type: CoinIdentifier })
  coin_identifier: CoinIdentifier;
  @ApiProperty({ type: 'string' })
  coin_action: CoinAction;
}

export class TokenBundleItem {
  policyId: string;
  tokens: Amount[];
}

export class PoolRegistrationParams {
  vrfKeyHash: string;
  rewardAddress: string;
  pledge: string;
  cost: string;
  poolOwners: string[];
  relays: Relay[];
  margin?: PoolMargin;
  margin_percentage?: string;
  poolMetadata?: PoolMetadata;
}

export class OperationMetadata {
  withdrawalAmount?: Amount;
  depositAmount?: Amount;
  refundAmount?: Amount;
  staking_credential?: PublicKey;
  pool_key_hash?: string;
  epoch?: number;
  tokenBundle?: TokenBundleItem[];
  poolRegistrationCert?: string;
  poolRegistrationParams?: PoolRegistrationParams;
  voteRegistrationMetadata?: VoteRegistrationMetadata;
}

export class Operation {
  @ApiProperty({ type: OperationIdentifier })
  operation_identifier: OperationIdentifier;
  @ApiProperty({ type: [OperationIdentifier] })
  related_operations?: OperationIdentifier[];
  @ApiProperty({ type: 'string' })
  type: string;
  @ApiProperty({ type: 'string' })
  status?: string;
  @ApiProperty({ type: AccountIdentifier })
  account?: AccountIdentifier;
  @ApiProperty({ type: Amount })
  amount?: Amount;
  @ApiProperty({ type: CoinChange })
  coin_change?: CoinChange;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: OperationMetadata;
}
export class Transaction {
  @ApiProperty({ type: TransactionIdentifier })
  transaction_identifier: TransactionIdentifier;
  @ApiProperty({ type: [Operation] })
  operations: Operation[];
  @ApiProperty({ type: [RelatedTransaction] })
  related_transactions?: RelatedTransaction[];
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: {
    size: number;
    scriptSize: number;
  };
}

export class Block {
  @ApiProperty({ type: BlockIdentifier })
  block_identifier: BlockIdentifier;
  @ApiProperty({ type: BlockIdentifier })
  parent_block_identifier: BlockIdentifier;
  @ApiProperty({ type: 'number' })
  timestamp: Timestamp;
  @ApiProperty({ type: [Transaction] })
  transactions: Transaction[];
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: {
    transactionsCount?: number;
    createdBy?: string;
    size?: number;
    epochNo?: number;
    slotNo?: number;
  };
}

export class BlockRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: PartialBlockIdentifier })
  block_identifier: PartialBlockIdentifier;
}

export class BlockResponse {
  @ApiProperty({ type: Block })
  block: Block;
  @ApiProperty({ type: [TransactionIdentifier] })
  other_transactions?: TransactionIdentifier[];
}

export class BlockTransaction {
  @ApiProperty({ type: BlockIdentifier })
  block_identifier: BlockIdentifier;
  @ApiProperty({ type: Transaction })
  transaction: Transaction;
}

export class BlockTransactionRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: BlockIdentifier })
  block_identifier: BlockIdentifier;
  @ApiProperty({ type: TransactionIdentifier })
  transaction_identifier: TransactionIdentifier;
}
export class BlockTransactionResponse {
  @ApiProperty({ type: Transaction })
  transaction: Transaction;
}
export class CallRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: 'string' })
  method: string;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  parameters: Record<string, any>;
}
export class CallResponse {
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  result: Record<string, any>;
  @ApiProperty({ type: 'boolean' })
  idempotent: boolean;
}

export class MempoolResponse {
  @ApiProperty({ type: [TransactionIdentifier] })
  transaction_identifiers: TransactionIdentifier[];
}

export class MetadataRequest {
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class NetworkListResponse {
  @ApiProperty({ type: [NetworkIdentifier] })
  network_identifiers: NetworkIdentifier[];
}

export class OperationStatus {
  @ApiProperty({ type: 'string' })
  status: string;
  @ApiProperty({ type: 'boolean' })
  successful: boolean;
}

export class BalanceExemption {
  @ApiProperty({ type: 'string' })
  sub_account_address?: string;
  @ApiProperty({ type: Currency })
  Currency?: Currency;
  @ApiProperty({ type: 'string' })
  exemption_type?: ExemptionType;
}

export class Allow {
  @ApiProperty({ type: [OperationStatus] })
  operation_statuses: OperationStatus[];
  @ApiProperty({ type: 'string', isArray: true })
  operation_types: string[];
  @ApiProperty({ type: Error })
  errors: Error[];
  @ApiProperty({ type: 'boolean' })
  historical_balance_lookup: boolean;
  @ApiProperty({ type: 'number' })
  timestamp_start_index?: number;
  @ApiProperty({ type: 'string', isArray: true })
  call_methods: string[];
  @ApiProperty({ type: [BalanceExemption] })
  balance_exemptions: BalanceExemption[];
  @ApiProperty({ type: 'boolean' })
  mempool_coins: boolean;
}

export class SyncStatus {
  @ApiProperty({ type: 'number' })
  current_index?: number;
  @ApiProperty({ type: 'number' })
  target_index?: number;
  @ApiProperty({ type: 'string' })
  stage?: string;
  @ApiProperty({ type: 'boolean' })
  synced?: boolean;
}

export class Version {
  @ApiProperty({ type: 'string' })
  rosetta_version: string;
  @ApiProperty({ type: 'string' })
  node_version: string;
  @ApiProperty({ type: 'string' })
  middleware_version?: string;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class Peer {
  @ApiProperty({ type: 'string' })
  peer_id: string;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class NetworkOptionsResponse {
  @ApiProperty({ type: Version })
  version: Version;
  @ApiProperty({ type: Allow })
  allow: Allow;
}
export class NetworkRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}
export class NetworkStatusResponse {
  @ApiProperty({ type: BlockIdentifier })
  current_block_identifier: BlockIdentifier;
  @ApiProperty({ type: 'number' })
  current_block_timestamp: Timestamp;
  @ApiProperty({ type: BlockIdentifier })
  genesis_block_identifier: BlockIdentifier;
  @ApiProperty({ type: BlockIdentifier })
  oldest_block_identifier?: BlockIdentifier;
  @ApiProperty({ type: SyncStatus })
  sync_status?: SyncStatus;
  @ApiProperty({ type: [Peer] })
  peers: Peer[];
}

export class PublicKey {
  @ApiProperty({ type: 'string' })
  hex_bytes: string;
  @ApiProperty({
    type: 'string',
    example: ['secp256k1', 'secp256r1', 'edwards25519', 'tweedle'],
  })
  curve_type: CurveType;
}

export class ConstructionDeriveRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: PublicKey })
  public_key: PublicKey;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: {
    staking_credential?: PublicKey;
    address_type?: AddressType;
  };
}

export class ConstructionDeriveResponse {
  @ApiProperty({ type: 'string' })
  address?: string;
  @ApiProperty({ type: AccountIdentifier })
  account_identifier: AccountIdentifier;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata?: Record<string, any>;
}

export class ConstructionMetadataRequest {
  @ApiProperty({ type: NetworkIdentifier })
  network_identifier: NetworkIdentifier;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  options: {
    relative_ttl: number;
    transaction_size: number;
  };
  @ApiProperty({ type: [PublicKey] })
  public_keys?: PublicKey[];
}
export class ConstructionMetadataResponse {
  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  metadata: {
    ttl?: string;
  };
  @ApiProperty({ type: [Amount] })
  suggested_fee?: Amount[];
}

export declare type AddressType = string;

export class BlockEvent {
  sequence: number;
  block_identifier: BlockIdentifier;
  type: BlockEventType;
}
export declare type BlockEventType = 'block_added' | 'block_removed';

export declare type CoinAction = 'coin_created' | 'coin_spent';

export class ConstructionCombineRequest {
  network_identifier: NetworkIdentifier;
  unsigned_transaction: string;
  signatures: Signature[];
}
export class ConstructionCombineResponse {
  signed_transaction: string;
}

export class ConstructionHashRequest {
  network_identifier: NetworkIdentifier;
  signed_transaction: string;
}

export class ConstructionParseRequest {
  network_identifier: NetworkIdentifier;
  signed: boolean;
  transaction: string;
}
export class ConstructionParseResponse {
  operations: Operation[];
  signers?: string[];
  account_identifier_signers: AccountIdentifier[];
  metadata?: Record<string, any>;
}
export class ConstructionPayloadsRequest {
  network_identifier: NetworkIdentifier;
  operations: Operation[];
  metadata: {
    ttl: string;
  };
  public_keys?: PublicKey[];
}
export class ConstructionPayloadsResponse {
  unsigned_transaction: string;
  payloads: SigningPayload[];
}
export class ConstructionPreprocessRequest {
  network_identifier: NetworkIdentifier;
  operations: Operation[];
  metadata?: {
    relative_ttl: number;
  };
  max_fee?: Amount[];
  suggested_fee_multiplier?: number;
}
export class ConstructionPreprocessResponse {
  options?: {
    relative_ttl: number;
    transaction_size: number;
  };
  required_public_keys?: AccountIdentifier[];
}
export class ConstructionSubmitRequest {
  network_identifier: NetworkIdentifier;
  signed_transaction: string;
}

export declare type CurveType =
  | 'secp256k1'
  | 'secp256r1'
  | 'edwards25519'
  | 'tweedle';
export declare type Direction = 'forward' | 'backward';

export class EventsBlocksRequest {
  network_identifier: NetworkIdentifier;
  offset?: number;
  limit?: number;
}
export class EventsBlocksResponse {
  max_sequence: number;
  events: BlockEvent[];
}
export declare type ExemptionType =
  | 'greater_or_equal'
  | 'less_or_equal'
  | 'dynamic';

export declare type Operator = 'or' | 'and';

export class PoolMargin {
  numerator: string;
  denominator: string;
}
export class PoolMetadata {
  url: string;
  hash: string;
}

export class Relay {
  type?: string;
  ipv4?: string;
  ipv6?: string;
  dnsName?: string;
  port?: string;
}
export class SearchTransactionsRequest {
  network_identifier: NetworkIdentifier;
  operator?: Operator;
  max_block?: number;
  offset?: number;
  limit?: number;
  transaction_identifier?: TransactionIdentifier;
  account_identifier?: AccountIdentifier;
  coin_identifier?: CoinIdentifier;
  Currency?: Currency;
  status?: string;
  type?: string;
  address?: string;
  success?: boolean;
}
export class SearchTransactionsResponse {
  transactions: BlockTransaction[];
  total_count: number;
  next_offset?: number;
}
export class Signature {
  signing_payload: SigningPayload;
  public_key: PublicKey;
  signature_type: SignatureType;
  hex_bytes: string;
}
export declare type SignatureType =
  | 'ecdsa'
  | 'ecdsa_recovery'
  | 'ed25519'
  | 'schnorr_1'
  | 'schnorr_poseidon';
export class SigningPayload {
  address?: string;
  account_identifier?: AccountIdentifier;
  hex_bytes: string;
  signature_type?: SignatureType;
}

export class TransactionIdentifierResponse {
  transaction_identifier: TransactionIdentifier;
  metadata?: Record<string, any>;
}
export class Utxo {
  value: string;
  index: number;
  transactionHash: string;
}

export class VoteRegistrationMetadata {
  stakeKey: PublicKey;
  votingKey: PublicKey;
  rewardAddress: string;
  votingNonce: number;
  votingSignature: string;
}

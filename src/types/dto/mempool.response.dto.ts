import { ApiProperty } from '@nestjs/swagger';

export class Transaction {
  hash: string;
}

export class MempoolResponseDto {
  @ApiProperty({ type: [Transaction] })
  transaction_identifiers: Transaction[];
}

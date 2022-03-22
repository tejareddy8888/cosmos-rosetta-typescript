import { ApiProperty } from '@nestjs/swagger';

import { Currency } from './currency.dto';
import { BlockIdentifier } from './block.dto';

export class Balance {
  @ApiProperty({ type: 'string' })
  value: string;
  @ApiProperty({ type: Currency })
  currency: Currency;
}

export class AccountBalanceResponsetDto {
  @ApiProperty({ type: BlockIdentifier })
  block_identifier: BlockIdentifier;
  @ApiProperty({ type: [Balance] })
  balances: Balance[];
}

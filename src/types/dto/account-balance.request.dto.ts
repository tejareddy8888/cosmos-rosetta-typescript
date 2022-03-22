import { ApiProperty } from '@nestjs/swagger';

import { Currency } from './currency.dto';
import { NetworkInfo } from './network.info';

export class Address {
  @ApiProperty({ type: 'string' })
  address: string;
}

export class AccountIdentifier extends Address {
  @ApiProperty({ type: Address })
  sub_account?: Address;
}

export class AccountBalanceRequestDto extends NetworkInfo {
  @ApiProperty({ type: AccountIdentifier })
  account_identifier: AccountIdentifier;
  @ApiProperty({ type: [Currency] })
  currencies: Currency[];
}

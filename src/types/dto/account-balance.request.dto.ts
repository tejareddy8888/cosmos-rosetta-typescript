import { ApiProperty } from '@nestjs/swagger';

import { Currency } from './currency.dto';
import { NetworkInfo } from './network.info';
import { AccountIdentifier } from './address.dto';

export class AccountBalanceRequestDto extends NetworkInfo {
  @ApiProperty({ type: AccountIdentifier })
  account_identifier: AccountIdentifier;
  @ApiProperty({ type: [Currency] })
  currencies: Currency[];
}

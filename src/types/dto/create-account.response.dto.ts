import { ApiProperty } from '@nestjs/swagger';

import { AccountIdentifier } from './address.dto';

export class CreateAccountResponseDto {
  @ApiProperty({ type: 'string' })
  address: string;
  @ApiProperty({ type: AccountIdentifier })
  account_identifier: AccountIdentifier;
}

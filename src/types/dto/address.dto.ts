import { ApiProperty } from '@nestjs/swagger';

export class Address {
  @ApiProperty({ type: 'string' })
  address: string;
}

export class AccountIdentifier extends Address {
  @ApiProperty({ type: Address })
  sub_account?: Address;
}

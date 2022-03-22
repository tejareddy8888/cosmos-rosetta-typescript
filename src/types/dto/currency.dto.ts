import { ApiProperty } from '@nestjs/swagger';

export class Currency {
  @ApiProperty({ type: 'string' })
  symbol: string;
  @ApiProperty({ type: 'string' })
  decimals: string;
}

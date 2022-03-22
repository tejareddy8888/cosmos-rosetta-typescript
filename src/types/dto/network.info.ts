import { ApiProperty } from '@nestjs/swagger';

export class NetworkInfo {
    @ApiProperty({ type: 'string' })
    blockchain: string;
    @ApiProperty({ type: 'string' })
    network: string;
  }
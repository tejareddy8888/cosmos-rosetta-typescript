import { ApiProperty } from '@nestjs/swagger';

import { NetworkInfo } from './network.info';

export class PublicKeyAlgo {
  hex_bytes: string;
  curve_type: string;
}

export class CreateAccountRequestDto extends NetworkInfo {
  @ApiProperty({ type: 'string' })
  metadata?: string;
  public_key: PublicKeyAlgo;
}

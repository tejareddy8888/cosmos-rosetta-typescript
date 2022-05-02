import { ApiProperty } from '@nestjs/swagger';

import { NetworkInfo } from './network.info';

export class MempoolRequestDto extends NetworkInfo {
  @ApiProperty({ type: 'string' })
  limit?: string;
}

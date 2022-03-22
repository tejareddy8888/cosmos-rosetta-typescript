import { ApiProperty } from '@nestjs/swagger';

import { NetworkInfo } from './network.info';

export class NetworkResponseDto {
  @ApiProperty({ type: [NetworkInfo] })
  network_identifiers: NetworkInfo[];
}

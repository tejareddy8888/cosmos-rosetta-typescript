import { ApiProperty } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty({ type: 'string' })
  producer?: string;
}

export class NetworkRequestDto {
  @ApiProperty({ type: Metadata })
  metadata: Metadata;
}

import { ApiProperty } from '@nestjs/swagger';

export class BlockIdentifier {
  @ApiProperty({ type: 'string' })
  index: string;
  @ApiProperty({ type: 'string' })
  hash: string;
}
import { ApiProperty } from '@nestjs/swagger';

import { BlockIdentifier } from './block.dto';

export class SyncStatus {
  @ApiProperty({ type: 'number' })
  current_index?: number;
  @ApiProperty({ type: 'number' })
  target_index?: number;
  @ApiProperty({ type: 'string' })
  stage?: string;
  @ApiProperty({ type: 'boolean' })
  synced: boolean;
}

export class PeerID {
  @ApiProperty({ type: 'string' })
  peer_id: string;
}
export class NetworkStatusResponseDto {
  @ApiProperty({ type: BlockIdentifier })
  current_block_identifier: BlockIdentifier;
  @ApiProperty({ type: 'number' })
  current_block_timestamp: number;
  @ApiProperty({ type: BlockIdentifier })
  genesis_block_identifier: BlockIdentifier;
  @ApiProperty({ type: BlockIdentifier })
  oldest_block_identifier: BlockIdentifier;
  @ApiProperty({ type: SyncStatus })
  sync_status: SyncStatus;
  @ApiProperty({ type: [PeerID] })
  peers: PeerID[];
}

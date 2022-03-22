import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

@Module({
  imports: [ConfigModule],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}

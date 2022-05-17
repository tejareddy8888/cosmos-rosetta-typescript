import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { IndexerController } from './indexer.controller';
import { IndexerService } from './indexer.service';

@Module({
  imports: [ConfigModule],
  controllers: [IndexerController],
  providers: [IndexerService],
})
export class IndexerModule {}

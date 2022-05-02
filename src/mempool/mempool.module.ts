import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { MempoolController } from './mempool.controller';
import { MempoolService } from './mempool.service';

@Module({
  imports: [ConfigModule],
  controllers: [MempoolController],
  providers: [MempoolService],
})
export class MempoolModule {}

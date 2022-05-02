import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';

@Module({
  imports: [ConfigModule],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}

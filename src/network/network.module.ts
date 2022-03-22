import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';

@Module({
  imports: [ConfigModule],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}

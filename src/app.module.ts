import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockModule } from './block/block.module';
import { CallModule } from './call/call.module';
import { ConfigModule } from './config/config.module';
import { ConstructionModule } from './construction/construction.module';
import { MempoolModule } from './mempool/mempool.module';
import { NetworkModule } from './network/network.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    NetworkModule,
    MempoolModule,
    ConstructionModule,
    CallModule,
    BlockModule,
    AccountModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

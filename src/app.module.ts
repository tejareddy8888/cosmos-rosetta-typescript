import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from './account/account.module';
import { BlockModule } from './block/block.module';
import { CallModule } from './call/call.module';
import { ConfigModule } from './config/config.module';
import { ConstructionModule } from './construction/construction.module';
import { LoggerModule, RequestLoggerMiddleware } from './logger';
import { MempoolModule } from './mempool/mempool.module';
import { NetworkModule } from './network/network.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    LoggerModule,
    NetworkModule,
    MempoolModule,
    ConstructionModule,
    CallModule,
    BlockModule,
    AccountModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('/');
  }
}

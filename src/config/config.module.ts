import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { TransactionEntity } from '../entities';
import { ConfigService } from './config.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

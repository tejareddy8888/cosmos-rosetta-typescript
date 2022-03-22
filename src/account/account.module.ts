import { Module } from '@nestjs/common';

import { ConfigModule } from 'src/config/config.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [ConfigModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}

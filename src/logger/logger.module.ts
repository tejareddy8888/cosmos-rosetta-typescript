import { Module } from '@nestjs/common';

import { AdapterLogger } from './logger.service';

@Module({
  controllers: [],
  providers: [AdapterLogger],
  exports: [AdapterLogger],
})
export class LoggerModule {}

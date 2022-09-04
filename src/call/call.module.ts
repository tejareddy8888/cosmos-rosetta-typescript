import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config';
import { CallController } from './call.controller';
import { CallService } from './call.service';

@Module({
  imports: [ConfigModule],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}

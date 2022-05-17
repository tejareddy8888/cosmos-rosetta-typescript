import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config';
import { ConstructionController } from './construction.controller';
import { ConstructionService } from './construction.service';

@Module({
  imports: [ConfigModule],
  controllers: [ConstructionController],
  providers: [ConstructionService],
})
export class ConstructionModule {}

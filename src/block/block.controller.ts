import { Controller, Get } from '@nestjs/common';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get()
  async getBlock(): Promise<string> {
    return await this.blockService.getBlock();
  }
}

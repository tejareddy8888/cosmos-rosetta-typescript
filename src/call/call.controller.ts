import { Controller, Get } from '@nestjs/common';
import { CallService } from './call.service';

@Controller('/call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Get()
  getHello(): string {
    return this.callService.getHello();
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { CallRequest, CallResponse, Error } from 'src/types';
import { CallService } from './call.service';

@Controller('/call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  getCalledFunction(@Body() request: CallRequest): CallResponse | Error {
    return this.callService.getCall(request);
  }
}

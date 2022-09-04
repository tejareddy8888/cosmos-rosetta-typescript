import { Controller, Post, Body } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CallRequest, CallResponse, Error } from 'src/types';
import { CallService } from './call.service';

@Controller('/call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Returns the result of the JSON_RPC call made on the network',
    type: CallResponse,
  })
  async getCalledFunction(
    @Body() request: CallRequest,
  ): Promise<CallResponse | Error> {
    return await this.callService.getCall(request);
  }
}

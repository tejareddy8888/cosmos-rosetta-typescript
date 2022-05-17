import { Injectable } from '@nestjs/common';
import { CallRequest, CallResponse, Error } from 'src/types';

@Injectable()
export class CallService {
  getCall(request: CallRequest): CallResponse | Error {
    return {
      code: 404,
      message: 'unsupported action',
      retriable: false,
    };
  }
}

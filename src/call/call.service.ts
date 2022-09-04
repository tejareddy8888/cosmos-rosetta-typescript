import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { ConfigService } from 'src/config';
import { AdapterLogger } from 'src/logger';
import { CallRequest, CallResponse, Error } from 'src/types';

@Injectable()
export class CallService {
  private readonly logger: AdapterLogger;
  constructor(private readonly configService: ConfigService) {
    this.logger = new AdapterLogger(CallService.name);
  }
  async getCall(request: CallRequest): Promise<CallResponse | Error> {
    switch (request.network_identifier.blockchain) {
      case 'cosmoshub-4': {
        const fetchedCallResponse = await this.configService.httpClient.execute(
          {
            id: '-1',
            jsonrpc: '2.0',
            method: request.method,
            params: [
              ...Object.values(request.parameters).map((e) => e.toString()),
            ],
          },
        );

        return {
          result: fetchedCallResponse.result,
          idempotent: true,
        };
      }
      default: {
        return {
          code: 404,
          message: `unspported network ${request.network_identifier}`,
          retriable: false,
        };
      }
    }
  }
}

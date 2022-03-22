import { Injectable } from '@nestjs/common';

@Injectable()
export class MempoolService {
  getHello(): string {
    return 'Hello World!';
  }
}

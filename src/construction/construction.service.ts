import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstructionService {
  getHello(): string {
    return 'Hello World!';
  }
}

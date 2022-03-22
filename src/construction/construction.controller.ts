import { Controller, Get } from '@nestjs/common';
import { ConstructionService } from './construction.service';

@Controller('/construction')
export class ConstructionController {
  constructor(private readonly constructionService: ConstructionService) {}

  @Get()
  getHello(): string {
    return this.constructionService.getHello();
  }
}

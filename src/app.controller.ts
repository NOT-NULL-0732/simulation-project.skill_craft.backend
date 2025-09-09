import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { v6 as uuid6 } from 'uuid';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(uuid6());
    return this.appService.getHello();
  }
}

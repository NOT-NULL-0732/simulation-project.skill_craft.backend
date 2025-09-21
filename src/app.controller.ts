import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CryptoService } from './modules/crypto/crypto.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cryptoService: CryptoService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}

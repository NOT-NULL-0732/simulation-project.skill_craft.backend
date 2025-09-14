import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CryptoService } from './modules/crypto/crypto.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cryptoService: CryptoService,
  ) {}

  @Get()
  getHello(
    @Query('enString') enString: string,
    @Query('addString') addString: string,
  ) {
    const enData = this.cryptoService.encrypted(enString);
    const deData = this.cryptoService.decrypted(enData + addString);
    return {
      enData,
      deData,
    };
  }
}

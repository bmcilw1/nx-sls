import { Controller, Get, Logger, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  getData(@Query() query: { message: string; phoneNumber: string }) {
    const msg = `phoneNumber: ${query.phoneNumber} message: ${query.message}`;
    this.logger.log(msg);
    return { msg };
  }
}

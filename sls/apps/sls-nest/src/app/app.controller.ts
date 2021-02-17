import { Controller, Get, Logger, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  getData(@Query() phoneNumber: string, @Query() message: string) {
    this.logger.log(`phoneNumber: ${phoneNumber} message: ${message}`);
    return this.appService.getData();
  }
}

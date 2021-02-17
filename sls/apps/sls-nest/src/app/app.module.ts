import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: environment.logLevel,
        prettyPrint: environment.prettyPrintLogs,
        useLevelLabels: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [{ provide: AppService, useFactory: () => new AppService() }],
})
export class AppModule {}

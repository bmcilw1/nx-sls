import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { Logger } from 'nestjs-pino';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { Handler, Context, APIGatewayProxyEvent } from 'aws-lambda';
import { ExpressAdapter } from '@nestjs/platform-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

export let cachedServer: Server;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

export async function bootstrapServer(globalPrefix: string) {
  if (!cachedServer) {
    const expressApp = express();
    const corsOptions = {
      origin: environment.origins,
      optionsSuccessStatus: 200,
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Accept',
        'Origin',
        'Id-Token',
        'Medable-Client-Key',
        'Cookie',
      ],
      credentials: true,
    };

    expressApp.use(cors(corsOptions));

    const nestApp = await getNestApp(globalPrefix, expressApp);
    nestApp.init();

    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }

  return Promise.resolve(cachedServer);
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  cachedServer = await bootstrapServer('api');
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

export async function getNestApp(globalPrefix: string, expressApp: Server) {
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp)
  );

  //get injectable instance of logger.
  const logger = nestApp.get(Logger);

  try {
    nestApp.use(eventContext());
    nestApp.useLogger(logger);
  } catch (error) {
    //can't use logger since we are trying to init logger in this try/catch
    console.error(error);
  }

  nestApp.use(json({ limit: '100mb' }));

  nestApp.setGlobalPrefix(globalPrefix);

  return nestApp;
}

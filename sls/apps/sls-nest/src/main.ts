import { environment } from './environments/environment';
import { bootstrapServer, cachedServer } from './handler';

async function startServer() {
  const globalPrefix = 'api';
  await bootstrapServer(globalPrefix);

  const port = environment.port;
  const host = environment.host;

  cachedServer.listen(port, host, () => {
    console.log(`Listening at ${host}:${port}/${globalPrefix}`);
  });
}

startServer();

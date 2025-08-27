import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config, validateConfig } from './config';

const app: Express = express();
const server = createServer(app);

validateConfig();

// Proxies
const mutationProxy = createProxyMiddleware({
  target: config.mutationServiceUrl,
  changeOrigin: true,
  timeout: 30000,

});

const queryProxy = createProxyMiddleware({
  target: config.queryServiceUrl,
  changeOrigin: true,
  timeout: 30000,

});

// Health check route (no proxy)
app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Main proxy logic
app.use((req: Request, res: Response, next) => {
  if (req.method === 'GET') {
    return queryProxy(req, res, next);
  } else {
    return mutationProxy(req, res, next);
  }
});

// Start server
async function start() {
  try {
    server.listen(config.port, () => {
      console.log(`API Gateway running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start API Gateway:', err);
    process.exit(1);
  }
}

// Graceful shutdown
function gracefulShutdown(signal: string) {
  return async () => {
    console.log(`\n Received ${signal}. Shutting down API Gateway...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };
}

process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));

start();

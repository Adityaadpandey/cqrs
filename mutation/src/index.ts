import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import { config } from './config';
import { connectKafka } from './kafka';
import { orderRouter } from './routes/order.router';
import { productRouter } from './routes/product.router';
import { userRouter } from './routes/user.router';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);

// Health Check
app.get('/healthz', (_, res) => {
  res.status(200).send('OK');
});

// Startup Function
async function start() {
  try {
    await connectKafka();

    server.listen(config.PORT, () => {
      console.log(`Mutation service running at http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start Mutation service:', err);
    process.exit(1);
  }
}

// Graceful Shutdown Handler
function gracefulShutdown(signal: string) {
  return async () => {
    console.log(`\nReceived ${signal}. Shutting down Mutation service...`);

    try {
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };
}

// System Signal Listeners
process.on('SIGINT', gracefulShutdown('SIGINT'));
process.on('SIGTERM', gracefulShutdown('SIGTERM'));

// Start the service
start();

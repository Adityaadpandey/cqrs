import express from "express";
import { createServer } from "http";
import morgan from "morgan";

import { config } from './config';
import { lastProcessedTimestamp, startEventConsumer, stopEventConsumer } from './kafka/consumer';
import { orderRouter } from './routes/order.router';
import { productRouter } from './routes/product.router';
import { userRouter } from './routes/user.router';

const app = express();
const PORT = config.PORT || 3125;

app.use(morgan("dev"));
app.use(express.json());

// API Routes
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

app.get("/sync-status", (_, res) => {
  res.status(200).json({
    lastProcessedTimestamp,
    isCaughtUp: lastProcessedTimestamp
      ? new Date().getTime() - new Date(lastProcessedTimestamp).getTime() < 5000
      : false,
  });
});



const server = createServer(app);

export async function start() {
  try {
    await startEventConsumer();
    server.listen(PORT, () => {
      console.log(`Query service running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start service:", err);
    process.exit(1);
  }
}

function gracefulShutdown(signal: string) {
  return async () => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    try {
      await stopEventConsumer?.();
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  };
}

// Listen to system signals for graceful shutdown
process.on("SIGINT", gracefulShutdown("SIGINT"));
process.on("SIGTERM", gracefulShutdown("SIGTERM"));

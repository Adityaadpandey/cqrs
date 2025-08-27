import cluster from "cluster";
import { start } from ".";
const numCPUs = 2;

if (cluster.isPrimary) {
    console.info(`Primary process ${process.pid} is running`);
    console.info(`Forking ${numCPUs} workers to utilize all CPU cores...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.warn(
            `Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Spawning a new one.`,
        );
        cluster.fork();
    });
} else {
    console.info(`Worker ${process.pid} started`);
    start();
}

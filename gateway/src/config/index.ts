interface Config {
  port: number;
  mutationServiceUrl: string;
  queryServiceUrl: string;
  nodeEnv: string;
  allowedOrigins?: string[];
}


// Configuration
export const config: Config = {
  port: parseInt(process.env.PORT || "3123", 10),
  mutationServiceUrl: process.env.MUTATION_SERVICE_URL || "http://localhost:3124",
  queryServiceUrl: process.env.QUERY_SERVICE_URL || "http://localhost:3125",
  nodeEnv: process.env.NODE_ENV || "development",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",")
};

// Validation
export const validateConfig = (): void => {
  const required: (keyof Config)[] = ["mutationServiceUrl", "queryServiceUrl"];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(", ")}`);
  }

  console.log("Configuration validated");
  console.log(`Mutation Service: ${config.mutationServiceUrl}`);
  console.log(`Query Service: ${config.queryServiceUrl}`);
};

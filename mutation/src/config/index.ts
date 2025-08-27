type config = {
    PORT: number;
    KAFKA_BROKER: string;
}

export const config: config = {
    PORT: parseInt(process.env.PORT || "3124", 10),
    KAFKA_BROKER: process.env.KAFKA_BROKER || "localhost:9094",
};

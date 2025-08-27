import { Kafka } from 'kafkajs'
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9094'],
})


export const consumer = kafka.consumer({ groupId: 'test-group'})

import { v4 as uuidv4 } from 'uuid';
import { producer } from '.';

export const sendMessage = async (
  type: string,
  messages: { key: string; value: any }[]
) => {
  const formattedMessages = messages.map(({ key, value }) => ({
    key,
    value: JSON.stringify({
      type,
      version: 1,
      traceId: uuidv4(),
      timestamp: new Date().toISOString(),
      data: value,
    }),
  }));

  await producer.send({
    topic: type, // <--- topic name based on type
    messages: formattedMessages,
  });
};

import { producer } from '.';

export const sendMessage = async (type: string, messages: { key: string, value: any }[]) => {
  const formattedMessages = messages.map(({ key, value }) => ({
    key,
    value: JSON.stringify({
      type,
      data: value
    })
  }));

  await producer.send({
    topic: 'test-topic',
    messages: formattedMessages,
  });
};

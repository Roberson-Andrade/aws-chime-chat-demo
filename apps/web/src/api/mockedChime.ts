import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { faker } from '@faker-js/faker';

export function generateMessages(numberOfMsgs: number): ChannelMessage[] {
  const newArray = Array.from({ length: numberOfMsgs });
  return newArray.map<ChannelMessage>(() => ({
    Content: faker.datatype.boolean()
      ? faker.lorem.sentences()
      : faker.lorem.words(4),
    CreatedTimestamp: faker.datatype.datetime({
      min: Date.now() - 10_000_000,
      max: Date.now(),
    }),
    Sender: {
      Arn: faker.datatype.boolean() ? 'arn1' : 'arn2',
    },
    MessageId: faker.datatype.uuid(),
  }));
}

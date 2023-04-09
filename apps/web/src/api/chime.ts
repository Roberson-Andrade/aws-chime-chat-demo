import {
  ChimeSDKMessagingClient,
  CreateChannelCommand,
} from '@aws-sdk/client-chime-sdk-messaging';
import { getAppInstanceArn, generateUserArn } from '../pages/chat/utils';

interface CreateChannelProperties {
  chimeClient: ChimeSDKMessagingClient;
  currentUserId: string;
  userToChatId: string;
}

export async function createChannel({
  chimeClient,
  currentUserId,
  userToChatId,
}: CreateChannelProperties) {
  const appInstanceArn = getAppInstanceArn();

  try {
    const channelResponse = await chimeClient.send(
      new CreateChannelCommand({
        AppInstanceArn: appInstanceArn,
        ChimeBearer: generateUserArn(currentUserId),
        Name: `${currentUserId}#${userToChatId}`,
        MemberArns: [
          generateUserArn(currentUserId),
          generateUserArn(userToChatId),
        ],
      })
    );

    if (!channelResponse.ChannelArn) {
      throw new Error('Error');
    }

    return channelResponse.ChannelArn;
  } catch (error) {
    console.log('error', error);
    return 'Error while creating chat channel';
  }
}

import { ChannelMessage } from '@aws-sdk/client-chime-sdk-messaging';
import { AllMessagesPayload, MessageAction } from '../../../../types';

export interface AddNewMessageActionReturn {
  type: MessageAction;
  payload: {
    newMessage: ChannelMessage;
    isMessageSentToSelectedChannel: boolean;
  };
}

export function addNewMessageAction(
  newMessage: ChannelMessage,
  isMessageSentToSelectedChannel: boolean
): AddNewMessageActionReturn {
  return {
    type: MessageAction.ADD_NEW_MESSAGE,
    payload: {
      newMessage,
      isMessageSentToSelectedChannel,
    },
  };
}

export interface AddAllMessagesActionReturn {
  type: MessageAction;
  payload: {
    newAllMessages: Map<string, AllMessagesPayload>;
  };
}

export function addAllMessagesAction(
  newAllMessages: Map<string, AllMessagesPayload>
): AddAllMessagesActionReturn {
  return {
    type: MessageAction.ADD_ALL_MESSAGES,
    payload: {
      newAllMessages,
    },
  };
}

export interface SetMessagesFromSelectedChannelReturn {
  type: MessageAction;
  payload: {
    messages: ChannelMessage[];
    token?: string;
  };
}

export function setMessagesFromSelectedChannelAction(
  messages: ChannelMessage[],
  token?: string
): SetMessagesFromSelectedChannelReturn {
  return {
    type: MessageAction.SET_MESSAGES_FROM_SELECTED_CHANNEL,
    payload: {
      messages,
      token,
    },
  };
}

export interface ResetMessagesReturn {
  type: MessageAction;
  payload: {
    messages: ChannelMessage[];
  };
}

export function resetMessagesAction(): ResetMessagesReturn {
  return {
    type: MessageAction.SET_MESSAGES_FROM_SELECTED_CHANNEL,
    payload: {
      messages: [],
    },
  };
}

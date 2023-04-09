import { MessageAction, MessageState } from '../../../../types';
import {
  AddAllMessagesActionReturn,
  AddNewMessageActionReturn,
  ResetMessagesReturn,
  SetMessagesFromSelectedChannelReturn,
} from './actions';

export type Action =
  | AddNewMessageActionReturn
  | AddAllMessagesActionReturn
  | SetMessagesFromSelectedChannelReturn
  | ResetMessagesReturn;

export function messagesReducer(
  state: MessageState,
  action: Action
): MessageState {
  switch (action.type) {
    case MessageAction.ADD_NEW_MESSAGE: {
      const { allMessages: previousAllMessages } = state;
      const { newMessage, isMessageSentToSelectedChannel } =
        action.payload as AddNewMessageActionReturn['payload'];

      const newState: MessageState = { ...state };

      if (previousAllMessages && newMessage.ChannelArn) {
        const existingChannelMessages = previousAllMessages.get(
          newMessage.ChannelArn
        );

        if (existingChannelMessages) {
          const updatedChannelMessages = {
            ...existingChannelMessages,
            messages: [...existingChannelMessages.messages, newMessage],
          };

          const newAllMessages = new Map(previousAllMessages.entries());

          newAllMessages.set(newMessage.ChannelArn, updatedChannelMessages);

          newState.allMessages = newAllMessages;
        } else {
          const newAllMessages = new Map(previousAllMessages.entries());

          newAllMessages.set(newMessage.ChannelArn, {
            messages: [newMessage],
          });

          newState.allMessages = newAllMessages;
        }
      }

      if (isMessageSentToSelectedChannel) {
        newState.messages = [...newState.messages, newMessage];
      }

      return newState;
    }

    case MessageAction.ADD_ALL_MESSAGES: {
      const { newAllMessages } =
        action.payload as AddAllMessagesActionReturn['payload'];

      return {
        ...state,
        allMessages: newAllMessages,
      };
    }

    case MessageAction.SET_MESSAGES_FROM_SELECTED_CHANNEL: {
      const { messages, token } =
        action.payload as SetMessagesFromSelectedChannelReturn['payload'];

      return {
        ...state,
        messages,
        token,
      };
    }

    case MessageAction.RESET_MESSAGES: {
      const { messages } = action.payload as ResetMessagesReturn['payload'];

      return {
        ...state,
        messages,
      };
    }

    default: {
      return state;
    }
  }
}

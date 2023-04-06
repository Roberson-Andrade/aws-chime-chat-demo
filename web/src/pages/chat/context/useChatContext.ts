import { useContext } from 'use-context-selector';
import { ChatContext, ChatContextProperties } from './Context';

export function useChatContext() {
  const value = useContext<ChatContextProperties | undefined>(ChatContext);

  if (!value) {
    throw new Error('UseChatContext should be called inside a ChatProvider');
  }

  return value;
}

import { useContextSelector } from 'use-context-selector';
import { ChatContext, ChatContextProperties } from './Context';

export function useChatContext<T>(
  selector: (values: ChatContextProperties | undefined) => T
) {
  const value = useContextSelector<ChatContextProperties | undefined, T>(
    ChatContext,
    selector
  );

  return value;
}

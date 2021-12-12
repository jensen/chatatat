import { useState, useEffect, useCallback } from "react";
import { useFetcher } from "remix";
import {
  IConversationMessageResource,
  IRoomMessageResource,
} from "~/services/types/resources";

interface IMessage extends IRoomMessageResource, IConversationMessageResource {
  local_id?: string;
}

export default function useMessages(url: string, reset: () => void) {
  const messages = useFetcher<IMessage>();
  const [state, setState] = useState<IMessage[]>([]);

  useEffect(() => {
    if (messages.data === undefined) return;

    if (Array.isArray(messages.data)) {
      setState(messages.data);
    } else {
      const { local_id, ...messageData } = messages.data;

      if (local_id) {
        setState((prev) =>
          prev.map((message) =>
            message.local_id === local_id ? messageData : message
          )
        );
      }
    }
  }, [messages.data]);

  useEffect(() => {
    messages.load(`${url}/messages`);
  }, [messages.load, url]);

  useEffect(() => {
    if (
      messages.state === "submitting" &&
      messages.type === "actionSubmission"
    ) {
      const latest: IMessage = Object.fromEntries(
        messages.submission.formData
      ) as unknown as IMessage;

      setState((prev) => [...prev, latest]);
      reset();
    }
  }, [messages.state, messages.type, messages.submission?.formData, reset]);

  return {
    messages: state,
    MessageForm: messages.Form,
    addMessage: useCallback(
      (message) => setState((prev) => [...prev, message]),
      []
    ),
  };
}

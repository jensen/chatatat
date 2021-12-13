import { useState, useEffect, useCallback } from "react";
import { useFetcher } from "remix";
import {
  IConversationMessageResource,
  IRoomMessageResource,
} from "~/services/types/resources";

export interface IMessage
  extends Omit<IRoomMessageResource, "id">,
    Omit<IConversationMessageResource, "id"> {
  id?: string;
  local_id?: string;
  upload: File;
}

export default function useMessages(url: string, reset: () => void) {
  const messages = useFetcher<IMessage | IMessage[]>();
  const [state, setState] = useState<IMessage[]>([]);

  useEffect(() => {
    messages.load(`${url}/messages`);
  }, [messages.load, url]);

  useEffect(() => {
    if (messages.state === "idle" && messages.type === "done") {
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
    }
  }, [messages.data, messages.state, messages.type]);

  useEffect(() => {
    if (
      messages.state === "submitting" &&
      messages.type === "actionSubmission" &&
      messages.submission?.formData
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
    submit: messages.submit,
    addMessage: useCallback(
      (message) => setState((prev) => [...prev, message]),
      []
    ),
  };
}

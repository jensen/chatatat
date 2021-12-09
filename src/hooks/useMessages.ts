import { useState, useEffect, useCallback } from "react";
import { useFetcher } from "remix";

export default function useMessages(url: string, reset: () => void) {
  const messages = useFetcher();
  const [state, setState] = useState<IMessageResource>([]);

  useEffect(() => {
    if (messages.data === undefined) return;

    if (messages.data) {
    }
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
      setState((prev) => [
        ...prev,
        Object.fromEntries(messages.submission.formData),
      ]);
      reset();
    }
  }, [messages.state]);

  return {
    messages: state,
    MessageForm: messages.Form,
    addMessage: useCallback(
      (message) => setState((prev) => [...prev, message]),
      []
    ),
  };
}

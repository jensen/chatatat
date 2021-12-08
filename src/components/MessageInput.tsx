import { useEffect, useRef, useState } from "react";
import { Form, useTransition } from "remix";
import { useSupabaseUser } from "~/context/supabase";

interface IMessageInputProps {}

export default function MessageInput(props: IMessageInputProps) {
  const inputRef = useRef(null);
  const transition = useTransition();
  const [content, setContent] = useState("");
  const user = useSupabaseUser();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (transition.submission) {
      setContent("");
    }
  }, [transition.submission]);

  return (
    <div className="p-4">
      <div className="bg-dusk rounded-lg">
        <Form method="post" action="messages">
          <input value={user?.id || ""} name="user_id" type="hidden" />
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            name="content"
            ref={inputRef}
            className="py-2 px-4 w-full bg-transparent focus:outline-none"
          />
        </Form>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useSupabaseUser } from "~/context/supabase";
import { v4 as uuid } from "uuid";

interface IMessageInputProps {}

export default function MessageInput(props: IMessageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useSupabaseUser();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const mustLogin =
    user === null
      ? {
          placeholder: "Must login to send a message.",
          disabled: true,
        }
      : {};

  return (
    <div className="border-gray-900 border-4 p-1 rounded-xl">
      <input value={uuid()} name="local_id" type="hidden" />
      <input value={user?.id || ""} name="user_id" type="hidden" />
      <input value={user?.id || ""} name="from_id" type="hidden" />
      <input
        name="content"
        ref={inputRef}
        className="bg-dusk py-1 px-2 w-full rounded-lg focus:outline-none disabled:opacity-50"
        type="text"
        {...mustLogin}
      />
    </div>
  );
}

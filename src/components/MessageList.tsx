import { useEffect, useRef } from "react";
import { useSupabaseUserCache } from "~/context/supabase";

interface IMessageListProps {
  messages: IMessageResource[];
}

export default function MessageList(props: IMessageListProps) {
  const { users } = useSupabaseUserCache();

  return (
    <div className="flex-1 flex flex-col-reverse p-2 relative overflow-y-auto">
      <ul className="w-full px-2 flex flex-col justify-end">
        {props.messages.map((message) => (
          <li key={message.id || message.local_id} className="text-sm">
            <span className="font-bold text-gray-300">
              {users[message.user_id || message.from_id].name}
            </span>
            <span className="font-light text-gray-400 ml-2">
              {message.content}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

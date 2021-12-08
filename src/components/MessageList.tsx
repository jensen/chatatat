import { useEffect, useRef } from "react";
import { useSupabaseUserCache } from "~/context/supabase";

interface IMessageListProps {
  messages: IMessageResource[];
  pending: any[];
}

export default function MessageList(props: IMessageListProps) {
  const { users } = useSupabaseUserCache();

  return (
    <div className="flex-1 flex flex-col-reverse p-2 relative overflow-y-scroll">
      <ul className="w-full p-2 flex flex-col justify-end">
        {props.messages.map((message) => (
          <li key={message.id} className="text-sm">
            <span className="font-bold text-gray-300">
              {users[message.user_id || message.from_id].name}
            </span>
            <span className="font-light text-gray-400 ml-2">
              {message.content}
            </span>
          </li>
        ))}
        {props.pending.map((message) => (
          <li key={message.id} className="text-sm opacity-30">
            <span className="font-bold text-gray-300">
              {users[message.user_id].name}
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

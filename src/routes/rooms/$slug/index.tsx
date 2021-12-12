import type {
  IRoomResource,
  IRoomMessageResource,
} from "~/services/types/resources";
import { useRef } from "react";
import { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import MessageList from "~/components/MessageList";
import MessageInput from "~/components/MessageInput";
import { supabase } from "~/util/auth";
import {
  useSupabaseSubscription,
  useSupabaseUserCache,
} from "~/context/supabase";
import useMessages, { IMessage } from "~/hooks/useMessages";

type RoomData = {
  messages: IRoomMessageResource[];
  room: IRoomResource;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data: room } = await db
    .from<IRoomResource>("rooms")
    .select("*")
    .match({ slug: params.slug })
    .single();

  return json({ room });
};

interface IRoomViewProps {
  room: IRoomResource;
}

const useRoomMessages = (
  room: { id: string; slug: string },
  reset: () => void
): [IMessage[], typeof MessageForm] => {
  const { messages, addMessage, MessageForm } = useMessages(
    `/rooms/${room.slug}`,
    reset
  );

  useSupabaseSubscription(`room_messages:room_id=eq.${room.id}`, addMessage);

  return [messages, MessageForm];
};

const View = (props: IRoomViewProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [messages, MessageForm] = useRoomMessages(props.room, () =>
    formRef.current?.reset()
  );
  const { users } = useSupabaseUserCache();

  return (
    <section className="h-full flex flex-col">
      <header className="bg-dusk px-4 py-2 shadow-md">
        <h2 className="uppercase text-sm text-gray-400">#{props.room.name}</h2>
        <h3 className="text-xs text-gray-400">
          {props.room.topic ? props.room.topic : "Set Topic"}
        </h3>
      </header>
      <MessageList
        messages={messages.map((message) => ({
          id: message.id || message.local_id || "",
          name: users[message.user_id || message.from_id].name || "",
          content: message.content,
        }))}
      />
      <div className="">
        <MessageForm
          ref={formRef}
          method="post"
          action={`/rooms/${props.room.slug}/messages`}
        >
          <MessageInput />
        </MessageForm>
      </div>
    </section>
  );
};

export default function Room() {
  let data = useLoaderData<RoomData>();

  return <View {...data} />;
}

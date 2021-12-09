import { useEffect, useState, useCallback, useRef } from "react";
import { LoaderFunction } from "remix";
import { useLoaderData, json, useFetcher } from "remix";
import MessageList from "~/components/MessageList";
import MessageInput from "~/components/MessageInput";
import { supabase } from "~/util/auth";
import { useSupabaseSubscription } from "~/context/supabase";
import useMessages from "~/hooks/useMessages";

type RoomData = {
  messages: IMessageResource[];
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

interface IPendingMessage {
  id: string;
  user_id: string;
}

const useRoomMessages = (
  room: { id: string; slug: string },
  reset: () => void
) => {
  const { messages, addMessage, MessageForm } = useMessages(
    `/rooms/${room.slug}`,
    reset
  );

  useSupabaseSubscription(`room_messages:room_id=eq.${room.id}`, addMessage);

  return [messages, MessageForm];
};

const View = (props: IRoomViewProps) => {
  const formRef = useRef<HTMLFormElement>();
  const [messages, MessageForm] = useRoomMessages(props.room, () =>
    formRef.current?.reset()
  );

  return (
    <section className="h-full flex flex-col">
      <header className="bg-dusk px-4 py-2 shadow-md">
        <h2 className="uppercase text-sm text-gray-400">#{props.room.name}</h2>
        <h3 className="text-xs text-gray-400">
          {props.room.topic ? props.room.topic : "Set Topic"}
        </h3>
      </header>
      <MessageList messages={messages} />
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

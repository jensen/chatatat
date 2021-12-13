import type {
  IRoomResource,
  IRoomMessageResource,
} from "~/services/types/resources";
import { useRef, useCallback } from "react";
import { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import MessageList from "~/components/MessageList";
import MessageInput from "~/components/MessageInput";
import { supabase } from "~/util/auth";
import { useSupabaseSubscription, useSupabaseUser } from "~/context/supabase";
import { useUsersCache } from "~/context/users";
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
  const user = useSupabaseUser();

  const { messages, addMessage, MessageForm } = useMessages(
    `/rooms/${room.slug}`,
    reset
  );

  useSupabaseSubscription<IRoomMessageResource>(
    `room_messages:room_id=eq.${room.id}`,
    {
      insert: (message) => {
        if (user && message.user_id !== user.id) {
          console.log("adding message");
          addMessage(message);
        }
      },
    }
  );

  return [messages, MessageForm];
};

const View = (props: IRoomViewProps) => {
  const { users } = useUsersCache();

  const formRef = useRef<HTMLFormElement>(null);

  const [messages, MessageForm] = useRoomMessages(
    props.room,
    useCallback(() => formRef.current?.reset(), [])
  );

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
          name: users[message.user_id].name || "",
          content: message.content,
        }))}
      />
      <div>
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

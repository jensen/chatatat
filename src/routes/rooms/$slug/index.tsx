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
import useMessages from "~/hooks/useMessages";
import { v4 as uuid } from "uuid";
import UploadButton from "~/components/UploadButton";

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

const View = (props: IRoomViewProps) => {
  const { users } = useUsersCache();

  const formRef = useRef<HTMLFormElement>(null);

  const user = useSupabaseUser();

  const { messages, addMessage, MessageForm, submit } = useMessages(
    `/rooms/${props.room.slug}`,
    useCallback(() => formRef.current?.reset(), [])
  );

  useSupabaseSubscription<IRoomMessageResource>(
    `room_messages:room_id=eq.${props.room.id}`,
    {
      insert: (message) => {
        if (user && message.user_id !== user.id) {
          addMessage(message);
        }
      },
    }
  );

  const action = `/rooms/${props.room.slug}/messages`;

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
      <div className="p-2 flex justify-between items-center space-x-2">
        <MessageForm
          className="w-full"
          ref={formRef}
          method="post"
          action={action}
        >
          <MessageInput />
        </MessageForm>
        {user && (
          <UploadButton
            onUpload={(url: string | null) => {
              if (url && user) {
                submit(
                  {
                    content: url,
                    user_id: user.id,
                    local_id: uuid(),
                  },
                  { method: "post", action }
                );
              }
            }}
          />
        )}
      </div>
    </section>
  );
};

export default function Room() {
  let data = useLoaderData<RoomData>();

  return <View {...data} />;
}

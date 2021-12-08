import { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, useTransition } from "remix";
import { useLoaderData, json, redirect, useFetcher } from "remix";
import MessageList from "~/components/MessageList";
import MessageInput from "~/components/MessageInput";
import { supabase } from "~/util/auth";
import {
  useSupabaseSubscription,
  useSupabaseUserCache,
  useSupabase,
} from "~/context/supabase";
import { indexed } from "~/util/transform";

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

  const { data: messages } = await db
    .from<IRoomMessageResource>("room_messages")
    .select("*")
    .match({ room_id: room?.id });

  return json({ messages, room });
};

interface IRoomViewProps {
  messages: IMessageResource[];
  room: IRoomResource;
  users: IUserResource[];
}

interface IPendingMessage {
  id: string;
  user_id: string;
}

const View = (props: IRoomViewProps) => {
  const [messages, reset] = useSupabaseSubscription(
    `room_messages:room_id=eq.${props.room.id}`
  );

  const [pending, setPending] = useState<IPendingMessage[]>([]);

  const transition = useTransition();

  useEffect(() => {
    if (transition.state === "idle") {
      setPending([]);
      reset();
    }

    if (transition.state === "submitting") {
      setPending((prev) => [
        ...prev,
        {
          ...(Object.fromEntries(
            transition.submission.formData
          ) as unknown as IPendingMessage),
        },
      ]);
    }
  }, [transition.state, transition.submission, reset]);

  return (
    <section className="h-full flex flex-col">
      <header className="bg-dusk px-4 py-2 shadow-md">
        <h2 className="uppercase text-sm text-gray-200">{props.room.name}</h2>
        <h3 className="text-xs text-gray-400">
          {props.room.topic ? props.room.topic : "Set Topic"}
        </h3>
      </header>
      <MessageList
        messages={[...props.messages, ...messages]}
        pending={pending}
      />
      <div className="">
        <MessageInput />
      </div>
    </section>
  );
};

export default function Room() {
  let data = useLoaderData<RoomData>();

  return <View {...data} />;
}

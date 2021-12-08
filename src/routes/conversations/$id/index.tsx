import { useEffect, useState } from "react";
import { ActionFunction, LoaderFunction, useTransition } from "remix";
import { useLoaderData, json, redirect, useFetcher } from "remix";
import MessageList from "~/components/MessageList";
import MessageInput from "~/components/MessageInput";
import { supabase, user } from "~/util/auth";
import {
  useSupabaseSubscription,
  useSupabaseUserCache,
  useSupabase,
  useSupabaseUser,
} from "~/context/supabase";

type RoomData = {
  messages: IMessageResource[];
  room: IRoomResource;
  users: { [key: string]: IUserResource };
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const u = await user(request);

  const { data: messages } = await db
    .from<IRoomMessageResource>("direct_messages")
    .select("*")
    .or(
      `and(from_id.eq.${u?.id},to_id.eq.${params.id}),and(from_id.eq.${params.id},to_id.eq.${u?.id})`
    );

  const { data } = await db
    .from<IUserResource>("profiles")
    .select()
    .match({ id: params.id })
    .single();

  return json({ messages, user: data });
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
  const [messages, reset] = useSupabaseSubscription(`direct_messages`);

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
        <h2 className="uppercase text-sm text-gray-200">{props.user.name}</h2>
      </header>
      <MessageList
        messages={[...props.messages, ...messages]}
        pending={pending}
        users={props.users}
      />
      <div className="">
        <MessageInput />
      </div>
    </section>
  );
};

export default function Conversation() {
  let data = useLoaderData<ConversationData>();

  return <View {...data} />;
}

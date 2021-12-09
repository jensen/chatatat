import { useRef } from "react";
import { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import MessageList from "~/components/MessageList";
import MessageInput from "~/components/MessageInput";
import { supabase } from "~/util/auth";
import { useSupabaseSubscription, useSupabaseUser } from "~/context/supabase";
import useMessages from "~/hooks/useMessages";

type RoomData = {
  messages: IMessageResource[];
  room: IRoomResource;
  users: { [key: string]: IUserResource };
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data } = await db
    .from<IUserResource>("profiles")
    .select()
    .match({ id: params.id })
    .single();

  return json({ user: data });
};

interface IRoomViewProps {
  messages: IMessageResource[];
  room: IRoomResource;
  users: IUserResource[];
}

const useConversationMessages = (user: { id: string }, reset: () => void) => {
  const { messages, addMessage, MessageForm } = useMessages(
    `/conversations/${user.id}`,
    reset
  );

  useSupabaseSubscription(`direct_messages:from_id=eq.${user.id}`, addMessage);

  return [messages, MessageForm];
};

const View = (props: IRoomViewProps) => {
  const formRef = useRef<HTMLFormElement>();
  const [messages, MessageForm] = useConversationMessages(props.user, () =>
    formRef.current?.reset()
  );

  return (
    <section className="h-full flex flex-col">
      <header className="bg-dusk px-4 py-2 shadow-md">
        <h2 className="uppercase text-sm text-gray-200 flex items-center">
          <img className="w-8 h-8 rounded-full" src={props.user.avatar} />
          <span className="ml-2 text-gray-400 font-bold">
            {props.user.name}
          </span>
        </h2>
      </header>
      <MessageList messages={messages} />
      <div className="">
        <MessageForm
          ref={formRef}
          method="post"
          action={`/conversations/${props.user.id}/messages`}
        >
          <MessageInput />
        </MessageForm>
      </div>
    </section>
  );
};

export default function Conversation() {
  let data = useLoaderData<ConversationData>();

  return <View {...data} />;
}

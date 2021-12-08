import type { ActionFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Outlet, redirect } from "remix";
import { supabase } from "~/util/auth";

import AddRoom from "~/components/AddRoom";
import ConversationList from "~/components/ConversationList";
import Logo from "~/components/Logo";
import RoomList from "~/components/RoomList";
import AddConversation from "~/components/AddConversation";

type IndexData = {
  rooms: IRoomResource[];
};

export let loader: LoaderFunction = async ({ request }) => {
  const db = await supabase(request);

  const { data: rooms, error } = await db.from<IRoomResource>("rooms").select();

  return json({ rooms });
};

interface IroomsViewProps {
  rooms: any[];
}

const View = (props: IroomsViewProps) => {
  return (
    <div className="h-full flex">
      <aside className="bg-twilight">
        <header className="p-4 flex items-center">
          <Logo />
          <div className="pl-2">
            <h2 className="text-xl font-bold text-gray-100">Chat</h2>
            <h3 className="text-xs font-light text-gray-300"></h3>
          </div>
        </header>
        <section>
          <AddRoom />
        </section>
        <RoomList rooms={props.rooms} />
        <section>
          <AddConversation />
        </section>
        <ConversationList conversations={[]} />
      </aside>
      <main className="flex-1 bg-midnight">
        <Outlet />
      </main>
    </div>
  );
};

export default function rooms() {
  let data = useLoaderData<IndexData>();

  return <View {...data} />;
}

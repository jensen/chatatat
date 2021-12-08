import type { LoaderFunction } from "remix";
import { useLoaderData, json, Outlet } from "remix";
import { supabase } from "~/util/auth";
import Logo from "~/components/Logo";

import RoomList from "~/components/RoomList";

type IndexData = {
  rooms: IRoom[];
};

export let loader: LoaderFunction = async ({ request }) => {
  const db = await supabase(request);

  const { data, error } = await db.from<IRoom>("rooms").select();

  return json({ rooms: data });
};

interface IIndexViewProps {
  rooms: any[];
}

const View = (props: IIndexViewProps) => {
  return (
    <div className="h-full flex">
      <aside className="bg-twilight">
        <header className="p-4 flex items-center">
          <Logo />
          <div className="pl-2">
            <h2 className="text-xl font-bold text-gray-100">Chat</h2>
            <h3 className="text-xs font-light text-gray-300">23 online</h3>
          </div>
        </header>
        <section>
          <div></div>
        </section>
        <RoomList rooms={props.rooms} />
      </aside>
      <main className="flex-1 bg-midnight">
        <Outlet />
      </main>
    </div>
  );
};

export default function Index() {
  let data = useLoaderData<IndexData>();

  return <View {...data} />;
}

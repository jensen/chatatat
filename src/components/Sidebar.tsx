import Logo from "~/components/Logo";
import RoomList from "~/components/RoomList";
import ConversationList from "~/components/ConversationList";
import DiscordButton from "~/components/DiscordButton";

import { useSupabaseUser } from "~/context/supabase";

export default function Sidebar(props) {
  const user = useSupabaseUser();

  return (
    <aside className="bg-twilight">
      <header className="p-4 flex items-center">
        <Logo />
        <div className="pl-2">
          <h2 className="text-xl font-bold text-gray-100">Chat</h2>
          <h3 className="text-xs font-light text-gray-300"></h3>
        </div>
      </header>
      <section className="px-4 py-2">
        {user === null && <DiscordButton />}
      </section>
      <RoomList rooms={props.rooms} />
      <br />
      <ConversationList conversations={props.conversations} />
    </aside>
  );
}

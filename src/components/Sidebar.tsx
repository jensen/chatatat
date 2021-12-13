import type {
  IConversationResource,
  IRoomResource,
} from "~/services/types/resources";
import { Link } from "remix";
import Logo from "~/components/Logo";
import SidebarList from "~/components/SidebarList";
import DiscordButton from "~/components/DiscordButton";
import LogoutButton from "~/components/LogoutButton";

import { useSupabaseUser } from "~/context/supabase";

interface ISidebarProps {
  rooms: IRoomResource[];
  conversations: IConversationResource[];
}

export default function Sidebar(props: ISidebarProps) {
  const user = useSupabaseUser();

  return (
    <aside className="bg-twilight">
      <section className="p-4">
        {user === null ? <DiscordButton /> : <LogoutButton />}
      </section>
      <Link to="/">
        <header className="p-4 flex items-center">
          <Logo />
          <div className="pl-2">
            <h2 className="text-xl font-bold text-gray-100">
              Chat<span className="text-gray-500">@@</span>
            </h2>
          </div>
        </header>
      </Link>
      <SidebarList title="Rooms" items={props.rooms} path="/rooms" />
      <br />
      {user && (
        <SidebarList
          title="Conversations"
          items={props.conversations}
          path="/conversations"
        />
      )}
    </aside>
  );
}

import { Link } from "remix";
import Logo from "~/components/Logo";
import SidebarList from "~/components/SidebarList";
import DiscordButton from "~/components/DiscordButton";
import LogoutButton from "~/components/LogoutButton";

import { useSupabaseUser } from "~/context/supabase";

export default function Sidebar(props) {
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
            <h2 className="text-xl font-bold text-gray-100">Chat</h2>
            <h3 className="text-xs font-light text-gray-300"></h3>
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

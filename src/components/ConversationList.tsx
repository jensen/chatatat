import { NavLink } from "remix";
import cx from "classnames";

import { useSupabaseUser } from "~/context/supabase";
import AddConversation from "~/components/AddConversation";

interface IConversationListProps {
  conversations: any[];
}

const activeStyle = {
  backgroundColor: "var(--dusk)",
  color: "#fff",
  boxShadow: "2px 2px 4px 1px rgba(0, 0, 0, 0.2)",
};

export default function ConversationList(props: IConversationListProps) {
  const user = useSupabaseUser();

  if (user === null) return null;

  return (
    <section className="px-4">
      <header className="px-2 py-4 text-gray-400 font-bold text-xs uppercase flex justify-between">
        Conversations
        <AddConversation />
      </header>
      <ul className="w-64 h-full">
        {props.conversations.map((conversation) => (
          <li
            key={conversation.id}
            className={cx("w-full text-gray-400 hover:text-gray-200 text-sm")}
          >
            <NavLink
              to={`/conversations/${conversation.id}`}
              className="block -full px-2 py-1 rounded"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              {conversation.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

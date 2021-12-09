import { NavLink } from "remix";
import cx from "classnames";

import { useSupabaseUser } from "~/context/supabase";
import AddButton from "~/components/AddButton";

interface ISidebarListProps {
  title: string;
  items: { id: string; slug?: string; name: string }[];
  path: string;
}

const activeStyle = {
  backgroundColor: "var(--dusk)",
  color: "#fff",
  boxShadow: "2px 2px 4px 1px rgba(0, 0, 0, 0.2)",
};

export default function SidebarList(props: ISidebarListProps) {
  const user = useSupabaseUser();

  if (user === null) return null;

  return (
    <section className="px-4">
      <header className="px-2 py-4 text-gray-400 font-bold text-xs uppercase flex justify-between">
        {props.title}
        <AddButton to={`${props.path}/new`} />
      </header>
      <ul className="w-64 h-full">
        {props.items.map((item) => (
          <li
            key={item.id}
            className={cx("w-full text-gray-400 hover:text-gray-200 text-sm")}
          >
            <NavLink
              to={`${props.path}/${item.slug || item.id}`}
              className="block -full px-2 py-1 rounded"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

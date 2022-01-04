import { NavLink } from "remix";
import cx from "classnames";

import AddButton from "~/components/AddButton";

interface ISidebarListProps {
  title: string;
  items: { id: string; slug?: string; name: string; avatar?: string }[];
  path: string;
}

const activeStyle = {
  backgroundColor: "var(--dusk)",
  color: "#fff",
  boxShadow: "2px 2px 4px 1px rgba(0, 0, 0, 0.2)",
};

export default function SidebarList(props: ISidebarListProps) {
  return (
    <section className="px-4">
      <header className="px-2 py-4 text-gray-400 font-bold text-sm uppercase flex justify-between">
        {props.title}
        <AddButton to={`${props.path}/new`} />
      </header>
      {props.items && (
        <ul className="w-64 h-full">
          {props.items.map((item) => (
            <li
              key={item.id}
              className={cx("w-full text-gray-400 hover:text-gray-200 text-sm")}
            >
              <NavLink
                to={`${props.path}/${item.slug || item.id}`}
                className="px-2 py-1 rounded flex items-center"
                style={({ isActive }) => (isActive ? activeStyle : {})}
              >
                {item.avatar ? (
                  <>
                    <img className="w-4 h-4 rounded-full" src={item.avatar} />
                    <span className="ml-2">{item.name}</span>
                  </>
                ) : (
                  item.name
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

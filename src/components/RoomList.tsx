import { NavLink } from "remix";
import cx from "classnames";
import AddRoom from "~/components/AddRoom";

interface IRoomListProps {
  rooms: any[];
}

const activeStyle = {
  backgroundColor: "var(--dusk)",
  color: "#fff",
  boxShadow: "2px 2px 4px 1px rgba(0, 0, 0, 0.2)",
};

export default function RoomList(props: IRoomListProps) {
  return (
    <section className="px-4">
      <header className="px-2 py-4 text-gray-400 font-bold text-xs uppercase flex justify-between">
        Rooms
        <AddRoom />
      </header>

      <ul className="w-64 h-full">
        {props.rooms.map((room) => (
          <li
            key={room.id}
            className={cx("w-full text-gray-400 hover:text-gray-200 text-sm")}
          >
            <NavLink
              to={`/rooms/${room.slug}`}
              className="block -full px-2 py-1 rounded"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              {room.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

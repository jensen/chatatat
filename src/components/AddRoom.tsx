import { Link } from "remix";

export default function AddRoom() {
  return (
    <Link to="/rooms/new">
      <div className="flex px-4 my-4 items-center">
        <div className="bg-yellow-400 w-4 h-4 rounded-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12px"
            height="12px"
            viewBox="0 0 384 512"
            fill="#27193d"
          >
            <path d="M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z" />
          </svg>
        </div>
        <div className="ml-2 text-gray-400 text-sm">New Room</div>
      </div>
    </Link>
  );
}

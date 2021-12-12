import { useEffect } from "react";
import { Link, useNavigate } from "remix";
import { useLocation } from "react-router";
import { useSupabaseUser } from "~/context/supabase";

export default function Index() {
  const navigate = useNavigate();
  const user = useSupabaseUser();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const redirect = query.get("redirect_to");

  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect]);

  return (
    <div className="h-full px-8 py-2 flex flex-col justify-center items-center">
      <h2 className="text-4xl sm:text-6xl text-yellow-400 font-bold">
        Welcome🎉
      </h2>
      <h2 className="mb-4 text-3xl text-yellow-200 font-bold">
        A few things to do.
      </h2>
      <h3 className="mb-1 text-md sm:text-xl">
        Join the{" "}
        <Link
          className="text-yellow-400 hover:text-yellow-200"
          to="/rooms/general"
        >
          General
        </Link>{" "}
        room.
      </h3>

      {user === null ? (
        <>
          <h3 className="mb-1 text-md sm:text-xl">Create a room.</h3>
          <h4 className="text-md sm:text-lg">
            Send a direct message to another user.
          </h4>
          <h2 className="mt-4 text-xs text-gray-400 font-light">
            Must login to create rooms and send messages.
          </h2>
        </>
      ) : (
        <>
          <h3 className="mb-1 text-md sm:text-xl">
            <Link
              className="text-yellow-400 hover:text-yellow-200"
              to="/rooms/new"
            >
              Create
            </Link>{" "}
            a room.
          </h3>
          <h4 className="text-md sm:text-lg">
            <Link
              className="text-yellow-400 hover:text-yellow-200"
              to="/conversations/new"
            >
              Send
            </Link>{" "}
            a direct message to another user.
          </h4>
        </>
      )}
    </div>
  );
}

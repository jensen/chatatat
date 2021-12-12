import { useNavigate, Link } from "remix";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSupabaseUser } from "~/context/supabase";
import { useUsersCache } from "~/context/users";

export default function NewRoom() {
  const u = useSupabaseUser();
  const { users } = useUsersCache();
  const navigate = useNavigate();

  const close = () => navigate(-1);

  return (
    <Transition appear show as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto bg-midnight"
        onClose={close}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-twilight shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-300"
              >
                Message User
              </Dialog.Title>
              <div className="mt-4 h-96 overflow-hidden">
                <ul className="space-y-2">
                  {Object.values(users)
                    .filter((user) => user.id !== u?.id)
                    .map((user) => (
                      <Link
                        key={user.id}
                        className="block"
                        to={`/conversations/${user.id}`}
                      >
                        <li className="flex items-center">
                          <img
                            className="w-8 h-8 rounded-full mr-4"
                            src={user.avatar}
                          />
                          {user.name}
                        </li>
                      </Link>
                    ))}
                </ul>
              </div>
              <div className="mt-6 space-x-2">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-300 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

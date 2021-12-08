import type { ActionFunction } from "remix";
import { useNavigate, redirect, Form } from "remix";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { supabase } from "~/util/auth";

export let action: ActionFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const body = await request.formData();

  const { data, error } = await db
    .from<IRoomResource>("rooms")
    .insert({
      name: body.get("name"),
      topic: body.get("topic"),
    })
    .single();

  return redirect(`/rooms/${data.slug}`);
};

export default function NewRoom() {
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
                Create Room
              </Dialog.Title>
              <Form method="post">
                <div className="mt-4">
                  <p className="mb-1 text-sm text-gray-400">
                    What would you like to call your room?
                  </p>
                  <input
                    name="name"
                    className="text-gray-200 bg-dusk rounded-md py-2 px-4 w-full"
                  />
                </div>
                <div className="mt-4">
                  <p className="mb-1 text-sm text-gray-400">
                    What is a good topic for the room?
                  </p>
                  <input
                    name="topic"
                    className="text-gray-200 bg-dusk rounded-md py-2 px-4 w-full"
                  />
                </div>

                <div className="mt-6 space-x-2">
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-indigo-900 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-300 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    onClick={close}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

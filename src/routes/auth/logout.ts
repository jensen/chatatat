import type { ActionFunction } from "remix";
import { redirect } from "remix";
import create from "~/util/session.server";

export let action: ActionFunction = async ({ request }) => {
  const { getSession, destroySession } = create();

  const session = await getSession(request.headers.get("Cookie"));
  const cookie = await destroySession(session);

  return redirect("/", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import create from "~/util/session.server";

export let action: ActionFunction = async ({ request, params, context }) => {
  return redirect("/");
};

export let loader: LoaderFunction = async ({ request, params, context }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("access_token");

  const { getSession, commitSession } = create();

  const session = await getSession(request.headers.get("Cookie"));

  session.set("token", token);

  const cookie = await commitSession(session);

  return redirect("/", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

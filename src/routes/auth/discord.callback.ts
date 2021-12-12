import type { LoaderFunction } from "remix";
import { redirect } from "remix";
import create from "~/util/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("access_token");
  const local = url.searchParams.get("redirect_to");

  const { getSession, commitSession } = create();

  const session = await getSession(request.headers.get("Cookie"));

  session.set("token", token);

  const cookie = await commitSession(session);

  return redirect(`/?redirect_to=${local}` || "/?redirect_to=/", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

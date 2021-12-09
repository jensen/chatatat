import type { ActionFunction } from "remix";
import { redirect } from "remix";

import create from "~/services";

if (typeof process.env.CLIENT_URL !== "string") {
  throw new Error("Must declare CLIENT_URL");
}

export let action: ActionFunction = async ({ request, params, context }) => {
  const supabase = create();

  const result = await supabase.auth.signIn(
    {
      provider: "discord",
    },
    {
      redirectTo: `${
        process.env.CLIENT_URL
      }/auth/discord/callback?redirect_to=${new URL(
        request.url
      ).searchParams.get("redirect_to")}`,
    }
  );

  return redirect(result?.url ?? "/");
};

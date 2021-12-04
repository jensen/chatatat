import type { ActionFunction } from "remix";
import { redirect } from "remix";

import create from "~/services";

export let action: ActionFunction = async ({ request, params, context }) => {
  const supabase = create();

  const result = await supabase.auth.signIn(
    {
      provider: "discord",
    },
    {
      redirectTo: "http://localhost:3000/auth/discord/callback",
    }
  );

  return redirect(result?.url ?? "/");
};

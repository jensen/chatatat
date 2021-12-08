import { ActionFunction } from "remix";
import { redirect } from "remix";
import { supabase, user } from "~/util/auth";

export let action: ActionFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const u = await user(request);

  const body = await request.formData();

  const { data, error } = await db.from("direct_messages").insert({
    from_id: u?.id,
    to_id: params.id,
    content: body.get("content"),
  });

  console.log(data, error);

  return redirect(`/conversations/${params.id}`);
};

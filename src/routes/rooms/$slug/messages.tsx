import { ActionFunction } from "remix";
import { redirect } from "remix";
import { supabase, user } from "~/util/auth";

export let action: ActionFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const body = await request.formData();

  const { data, error } = await db.rpc("post_message_to_room", {
    content: body.get("content"),
    room_slug: params.slug,
  });

  return redirect(`/rooms/${params.slug}`);
};

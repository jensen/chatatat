import { LoaderAction, ActionFunction } from "remix";
import { redirect, json } from "remix";
import { supabase, user } from "~/util/auth";

export let action: ActionFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const body = await request.formData();

  const { data, error } = await db.rpc("post_message_to_room", {
    content: body.get("content"),
    room_slug: params.slug,
  });

  return json({ ...data, local_id: body.get("local_id") });
};

export let loader: LoaderAction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data: room } = await db
    .from<IRoomResource>("rooms")
    .select("*")
    .match({ slug: params.slug })
    .single();

  const { data: messages } = await db
    .from<IRoomMessageResource>("room_messages")
    .select("*")
    .match({ room_id: room?.id })
    .order("created_at", {
      ascending: true,
    });

  return json(messages);
};

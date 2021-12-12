import type { IConversationMessageResource } from "~/services/types/resources";
import type { LoaderFunction, ActionFunction } from "remix";
import { json } from "remix";
import { supabase, user } from "~/util/auth";

export let action: ActionFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const u = await user(request);

  const body = await request.formData();

  const { data, error } = await db
    .from("direct_messages")
    .insert({
      from_id: u?.id,
      to_id: params.id,
      content: body.get("content"),
    })
    .single();

  return json({ ...data, local_id: body.get("local_id") });
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const u = await user(request);

  const { data: messages } = await db
    .from<IConversationMessageResource>("direct_messages")
    .select("*")
    .or(
      `and(from_id.eq.${u?.id},to_id.eq.${params.id}),and(from_id.eq.${params.id},to_id.eq.${u?.id})`
    )
    .order("created_at", {
      ascending: true,
    });

  return json(messages);
};

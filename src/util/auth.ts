import createSession from "./session.server";
import createSupabase from "~/services";

export const supabase = async (request) => {
  const { getSession } = createSession();

  const session = await getSession(request.headers.get("Cookie"));

  const token = session.get("token");

  return createSupabase(token);
};

export const user = async (request) => {
  const { getSession } = createSession();

  const session = await getSession(request.headers.get("Cookie"));

  const token = session.get("token");

  const { user, error } = await createSupabase(token).auth.api.getUser(token);

  return user;
};

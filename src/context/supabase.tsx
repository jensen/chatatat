import type {
  IRoomMessageResource,
  IConversationMessageResource,
} from "~/services/types/resources";
import { SupabaseClient, AuthUser } from "@supabase/supabase-js";
import React, { useEffect, useState, useContext, useCallback } from "react";
import create from "~/services";
import { useUsersCache } from "./users";

interface ISupabaseContext {
  supabase: SupabaseClient | null;
  user: AuthUser | null | undefined;
}

const SupabaseContext = React.createContext<ISupabaseContext>({
  supabase: null,
  user: null,
});

interface ISupabaseProviderProps {
  token: string;
  children: React.ReactNode;
}

export default function SupabaseProvider(props: ISupabaseProviderProps) {
  const { addUser } = useUsersCache();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const supabase = create(props.token);

    setSupabase(supabase);

    supabase.auth.api
      .getUser(props.token)
      .then(({ data, error }) => setUser(data));
  }, [props.token]);

  useEffect(() => {
    if (supabase) {
      const subscription = supabase
        .from("profiles")
        .on("INSERT", (payload) => addUser(payload.new))
        .subscribe();

      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, user }}>
      {props.children}
    </SupabaseContext.Provider>
  );
}

SupabaseProvider.defaultProps = {
  token: undefined,
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("Must useSupabase within a SupabaseProvider");
  }

  return context.supabase;
};

export const useSupabaseUser = () => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("Must useSupabase within a SupabaseProvider");
  }

  return context.user;
};

export function useSupabaseSubscription<T>(
  table: string,
  update: (item: T) => void
) {
  const supabase = useSupabase();
  const user = useSupabaseUser();
  const [state, setState] = useState<
    IRoomMessageResource[] | IConversationMessageResource[]
  >([]);

  const reset = useCallback(() => {
    setState([]);
  }, []);

  useEffect(() => {
    if (supabase) {
      const subscription = supabase
        .from(table)
        .on("INSERT", async (payload) => {
          if (payload.new.user_id) {
            if (payload.new.user_id !== user?.id) {
              update(payload.new);
            }
          }

          if (payload.new.from_id) {
            if (payload.new.from_id !== user?.id) {
              update(payload.new);
            }
          }
        })
        .subscribe();

      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [supabase, user, update, table]);

  return [state, reset];
}

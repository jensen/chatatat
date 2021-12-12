import type {
  IUserResource,
  IRoomMessageResource,
  IConversationMessageResource,
} from "~/services/types/resources";
import { SupabaseClient, AuthUser } from "@supabase/supabase-js";
import React, { useEffect, useState, useContext, useCallback } from "react";
import create from "~/services";

interface IIndexedUsers {
  [key: string]: IUserResource;
}

interface ISupabaseContext {
  supabase: SupabaseClient | null;
  user: AuthUser | null | undefined;
  users: IIndexedUsers;
}

const SupabaseContext = React.createContext<ISupabaseContext>({
  supabase: null,
  user: null,
  users: {},
});

interface IUser {
  id: string;
}

interface ISupabaseProviderProps {
  token: string;
  users: IIndexedUsers;
  children: React.ReactNode;
}

export default function SupabaseProvider(props: ISupabaseProviderProps) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(() => null);
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const [users, setUsers] = useState<IIndexedUsers>(props.users);

  useEffect(() => {
    const supabase = create(props.token);

    setSupabase(supabase);

    supabase.auth.api.getUser(props.token).then(({ data, error }) => {
      setUser(data);
    });
  }, [props.token]);

  useEffect(() => {
    if (supabase) {
      const subscription = supabase
        .from("profiles")
        .on("INSERT", (payload) =>
          setUsers((prev) => ({ ...prev, [payload.new.id]: payload.new }))
        )
        .subscribe();

      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, user, users }}>
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

export const useSupabaseUserCache = () => {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("Must useSupabase within a SupabaseProvider");
  }

  return {
    users: context.users,
  };
};

export const useSupabaseSubscription = (
  table: string,
  update: (item: any) => void
) => {
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
};

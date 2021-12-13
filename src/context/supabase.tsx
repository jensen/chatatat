import type { SupabaseRealtimeClient } from "@supabase/supabase-js/dist/main/lib/SupabaseRealtimeClient";
import {
  SupabaseClient,
  AuthUser,
  SupabaseRealtimePayload,
  RealtimeSubscription,
} from "@supabase/supabase-js";
import React, { useEffect, useState, useContext } from "react";
import create from "~/services";
import { useUsersCache } from "./users";
import { SupabaseEventTypes } from "@supabase/supabase-js/dist/main/lib/types";
import { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder";

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

type SubscriptionCallbackFunctionType<T> = (item: T) => void;

export function useSupabaseSubscription<T>(
  table: string,
  options: {
    insert?: SubscriptionCallbackFunctionType<T>;
    update?: SubscriptionCallbackFunctionType<T>;
    delete?: SubscriptionCallbackFunctionType<T>;
  }
) {
  const supabase = useSupabase();

  useEffect(() => {
    if (supabase && Object.keys(options).length > 0) {
      const subscription: RealtimeSubscription = (
        Object.entries(options).reduce<
          SupabaseRealtimeClient | SupabaseQueryBuilder<T>
        >(
          (s, [key, value]) =>
            s.on(
              key.toUpperCase() as SupabaseEventTypes,
              async (payload: SupabaseRealtimePayload<T>) => value(payload.new)
            ),
          supabase.from<T>(table)
        ) as unknown as SupabaseRealtimeClient
      ).subscribe();

      return () => {
        supabase.removeSubscription(subscription);
      };
    }
  }, [supabase, table, options.insert, options.update, options.delete]);
}

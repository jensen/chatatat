import { SupabaseClient, AuthUser } from "@supabase/supabase-js";
import React, { useEffect, useState, useContext } from "react";
import create from "~/services";

interface ISupabaseContext {
  supabase: SupabaseClient | null;
  user: AuthUser | null;
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
  const [supabase, setSupabase] = useState<SupabaseClient | null>(() =>
    create(props.token)
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const supabase = create(props.token);

    setSupabase(supabase);

    supabase.auth.api
      .getUser(props.token)
      .then(({ data, error }) => setUser(data));
  }, [props.token]);

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

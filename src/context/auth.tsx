import React from "react";
import { useSupabaseUser } from "~/context/supabase";

const AuthContext = React.createContext({});

export default function AuthProvider(props) {
  const user = useSupabaseUser();

  return (
    <AuthContext.Provider value={{ user }}>
      {props.children}
    </AuthContext.Provider>
  );
}

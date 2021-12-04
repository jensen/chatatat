import React from "react";
import { useSupabaseUser } from "~/context/supabase";

const AuthContext = React.createContext({});

export default function AuthProvider(props) {
  const user = useSupabaseUser();

  console.log(user);

  return (
    <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>
  );
}

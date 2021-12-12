import type { IUserResource } from "~/services/types/resources";
import React, { useCallback, useContext, useState } from "react";

interface IIndexedUsers {
  [key: string]: IUserResource;
}

interface IUsersContext {
  users: IIndexedUsers;
  addUser: (user: IUserResource) => void;
}

const UsersContext = React.createContext<IUsersContext>({
  users: {},
  addUser: (user) => null,
});

interface IUsersProviderProps {
  children: React.ReactNode;
  users: IIndexedUsers;
}

export default function UsersProvider(props: IUsersProviderProps) {
  const [users, setUsers] = useState(props.users);

  const addUser = useCallback((user: IUserResource) => {
    setUsers((prev) => ({ ...prev, [user.id]: user }));
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        addUser,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
}

export const useUsersCache = () => {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("Must useUsersCache within a UsersProvider");
  }

  return context;
};

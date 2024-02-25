import { createContext } from "react";

export const UserContext = createContext({
  userName: "",
  userId: "",
  setUserName: (name: string) => {},
  setUserId: (id: string) => {},
});

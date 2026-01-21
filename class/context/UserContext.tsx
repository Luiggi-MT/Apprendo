import { createContext, use } from "react";
import { UserContextType } from "../Interface/UserContextype";
import { Profesor } from "../Interface/Profesor";
import { Students } from "../Interface/Students";

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

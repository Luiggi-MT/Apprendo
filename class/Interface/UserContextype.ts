import { Profesor } from "./Profesor";
import { Students } from "./Students";

export interface UserContextType { 
    user: Profesor | Students | null;
    setUser: (user: Profesor | Students | null) => void;
}
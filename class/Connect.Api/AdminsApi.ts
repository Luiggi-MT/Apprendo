import { User } from "../Interface/User";
import { Api } from "./Api";

export class AdminsApi extends Api{
    public async getAdmins(): Promise<User[]> {
        try{
            const response = await fetch(`${Api.apiUrl}/admins`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data:User[] = await response.json();
            return data;
        }catch{
            return [];
        }
    }
}
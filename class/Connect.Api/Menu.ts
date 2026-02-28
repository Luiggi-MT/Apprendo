import { ApiResponse } from "../Interface/ApiResponse";
import { ApiResponseMenu } from "../Interface/ApiResponseMenu";
import { Api } from "./Api";
import { Menu as MenuInterface } from "../Interface/Menu";

export class Menu extends Api{
    public async getMenu(offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT, categoria: "menu" | "postre" = "menu"): Promise<ApiResponseMenu>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu?offset=${offset}&limit=${limit}&categoria=${categoria}`);
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseMenu = await response.json();
            return data; 
        }catch{
            return{ok: false, menus: [], offset: 0, count: 0};
        }
    }
    public async createMenu(menu: MenuInterface): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "menu": menu,
                })
            });
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return {
                ok: true,
                message:data,
            };
        }catch{
            return {ok:false, message: "Error al crear el menú"};
        }
    }
    public async getMenuById(menu_id: number): Promise<ApiResponseMenu>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu/${menu_id}`);
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseMenu = await response.json();
            
            if (data.menu === undefined) {
                return {ok: false, offset: 0, count: 0, menu: null};
            }
            return {
                ok: true,
                menu: data.menu,
                offset: data.offset,
                count: data.count
            };
        }catch{
            return{ok: false, offset: 0, count: 0};
        }
    }

    public async updateMenuById(menu: MenuInterface): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu/${menu.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "menu": menu,
                })
            });
            
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return {
                ok: true,
                message:data,
            };
        }catch{
            return {ok:false, message: "Error al actualizar el menú"};
        }
    }
    public async getMenuByName(name: string, offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT, categoria: "menu" | "postre" = "menu"): Promise<ApiResponseMenu | null>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu/${name}?offset=${offset}&limit=${limit}&categoria=${categoria}`);
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseMenu = await response.json(); 
            return data;
        }catch{
            return null;
        }
    }
    public async deleteMenuById(menu_id: number): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu/${menu_id}`,{
                method: "DELETE", 
                headers: {
                    "Content-Type" : "application/json",
                }
            });
            if(!response.ok){
                throw new Error("Network response was not ok"); 
            }
            const data = await response.json(); 
            return{
                ok: true, 
                message: data,
            }
        }catch{
            return {ok:false, message: "Error al eliminar el menú"};
        }
    }
}
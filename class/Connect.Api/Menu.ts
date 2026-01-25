import { ApiResponse } from "../Interface/ApiResponse";
import { ApiResponseMenu } from "../Interface/ApiResponseMenu";
import { Api } from "./Api";

export class Menu extends Api{
    public async getMenu(offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT, fecha: string): Promise<ApiResponseMenu>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu?offset=${offset}&limit=${limit}&fecha=${fecha}`);
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseMenu = await response.json();
            return data; 
        }catch{
            return{ok: false, menus: [], offset: 0, count: 0};
        }
    }
    public async createMenu(fecha: string, pictogramaMenuId: number, tachado: boolean, descripcion: string, primerPlato: string, primerPlatoId: number, segundoPlato: string, segundoPlatoId: number, guarnicion: string, guarnicionId: number, postre: string, postreId: number): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fecha,
                    pictogramaMenuId,
                    tachado,
                    descripcion,
                    primerPlato,
                    primerPlatoId,
                    segundoPlato,
                    segundoPlatoId,
                    guarnicion,
                    guarnicionId,
                    postre,
                    postreId
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

    public async updateMenuById(menu_id: number, fecha: string, pictogramaMenuId: number, tachado: boolean, descripcion: string, primerPlato: string, primerPlatoId: number, segundoPlato: string, segundoPlatoId: number, guarnicion: string, guarnicionId: number, postre: string, postreId: number): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/menu/${menu_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fecha,
                    pictogramaMenuId,
                    tachado,
                    descripcion,
                    primerPlato,
                    primerPlatoId,
                    segundoPlato,
                    segundoPlatoId,
                    guarnicion,
                    guarnicionId,
                    postre,
                    postreId
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
}
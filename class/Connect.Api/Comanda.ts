import { Api } from "./Api";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from "expo-sharing";
import { Platform } from 'react-native';
import {Menu as MenuInterface} from "../Interface/Menu";


export class Comanda extends Api {
    
    public async getDetalleComanda(id_tarea_estudiante: number, estudiante_id: number, fecha: string): Promise<{ aulas: any[], menu_del_dia: any[] } | null> {
        try {
            
            const response = await fetch(`${Api.apiUrl}/comanda/${id_tarea_estudiante}?estudiante_id=${estudiante_id}&fecha=${fecha}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Si usas JWT, añade aquí el Authorization: `Bearer ${token}`
                }, 
                
            });

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener detalle de comanda:", error);
            return null;
        }
    }

    public async getMenusConCantidades(limit: number, offset: number, tareaId: number, estudianteId: number, fecha: string, aulaId: number, categoria: "menu" | "postre" = "menu") {
        try {
            const response = await fetch(`${Api.apiUrl}/comanda/menus?limit=${limit}&offset=${offset}&tarea_id=${tareaId}&estudiante_id=${estudianteId}&fecha=${fecha}&aula_id=${aulaId}&categoria=${categoria}`);

            if (!response.ok) {
                throw new Error("Error al obtener menús");
            }

            return await response.json();

        } catch (error) {
            console.error("Error getMenusConCantidades:", error);
            return null;
        }
    }

    public async getMenusConCantidadesByName(limit: number, offset: number, tareaId: number, estudianteId: number, fecha: string, aulaId: number, search: string, categoria: "menu" | "postre" = "menu") {
        try {
            const response = await fetch(`${Api.apiUrl}/comanda/menus/${encodeURIComponent(search)}?limit=${limit}&offset=${offset}&tarea_id=${tareaId}&estudiante_id=${estudianteId}&fecha=${fecha}&aula_id=${aulaId}&categoria=${categoria}`);

            if (!response.ok) {
                throw new Error("Error al obtener menús por nombre");
            }

            return await response.json();

        } catch (error) {
            console.error("Error getMenusConCantidadesByName:", error);
            return null;
        }
    }

    public async setCantidadPedido(tareaId: number, estudianteId: number, fecha: string, aulaId: number, idMenu: number, idPlato: number, cantidad: number): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/comanda/pedido`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tarea_id: tareaId,
                    estudiante_id: estudianteId,
                    fecha,
                    aula_id: aulaId,
                    id_menu: idMenu,
                    id_plato: idPlato,
                    cantidad
                }),
            });

            return response.ok;
        } catch (error) {
            console.error("Error al actualizar cantidad del pedido:", error);
            return false;
        }
    }
    public async guardarVisitaAula(tarea_id: number, estudiante_id: number, fecha: string, aula_id: number): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/comanda/guardar-visita`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    tarea_id,
                                    estudiante_id,
                                    fecha,
                                    aula_id,
                                }),
        });

            return response.ok;
        } catch (error) {
            console.error("Error al guardar visita:", error);
            return false;
        }
    }


  
    public async getMenu(limit: number,  offset: number, id_visita: number = 0): Promise<{ platos: any[] }> {
        try {
            
            const url = `${Api.apiUrl}/menu-dia?limit=${limit}&offset=${offset}&id_visita=${id_visita}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error("Error al obtener el menú");

            const data = await response.json();
            return { platos: data.platos || [] };

        } catch (error) {
            console.error("Error en getMenuPorFecha:", error);
            return { platos: [] };
        }
    }

    public async getAulasComandaPorFecha(fecha: string, offset: number, limit: number): Promise<any[]> {
        try {
            // Construimos la URL con el parámetro de fecha
            const url = `${Api.apiUrl}/comanda/aula-fecha?fecha=${fecha}&offset=${offset}&limit=${limit}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error(`Error al obtener comanda: ${response.status}`);
                return [];
            }

            const data = await response.json();

            // Retornamos los datos. Si el backend no devuelve nada, aseguramos un array vacío.
            return data || [];
        } catch (error) {
            console.error("Error de red en getComandaDetalladaPorFecha:", error);
            return [];
        }
    }


    public async getComandaDetalladaPorFecha(fecha: string, idAula: number): Promise<any> {
        try {
            // Realizamos la petición al nuevo endpoint del backend
            const response = await fetch(`${Api.apiUrl}/comanda/detallada?fecha=${fecha}&id_aula=${idAula}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener la comanda detallada");
            }

            const data = await response.json();
            return data; // Retorna la lista de diccionarios con nombre_aula, plato, id_pictograma, etc.
        } catch (error) {
            console.error("Error en ConnectApi.getComandaDetallada:", error);
            return [];
        }
    }
    

    public async  downloadComandaPDF(fecha: string): Promise<void> {
  try {
    const url = `${Api.apiUrl}/comanda/descargar-pdf?fecha=${fecha}`;

    if (Platform.OS === "android" || Platform.OS === "ios") {
      const fileUri = `${FileSystem.documentDirectory}comanda_${fecha}.pdf`;

      const downloadRes = await FileSystem.downloadAsync(url, fileUri);

      if (downloadRes.status !== 200) {
        console.error("Error al descargar PDF:", downloadRes.status);
        return;
      }

      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        alert(`PDF descargado en: ${downloadRes.uri}`);
      }
    } else if (Platform.OS === "web") {
      // Crear enlace invisible para descargar en web
      const link = document.createElement("a");
      link.href = url;
      link.download = `comanda_${fecha}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error descargando PDF", error);
  }
}

}
import { Api } from "./Api";
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// Para eliminar 
import * as MediaLibrary from 'expo-media-library'; // Solo si quieres guardar en galería
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para token si es necesario

export class Comanda extends Api {
    
    public async getDetalleComanda(id_tarea_estudiante: number): Promise<{ aulas: any[], menu_del_dia: any[] } | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/comanda/${id_tarea_estudiante}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Si usas JWT, añade aquí el Authorization: `Bearer ${token}`
                }
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

    
    public async guardarVisitaAula(id_visita: number, pedidos: { id_plato: number, cantidad: number }[]): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/comanda/guardar-visita`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_visita: id_visita,
                    pedidos: pedidos
                })
            });

            return response.ok;
        } catch (error) {
            console.error("Error al guardar visita:", error);
            return false;
        }
    }

  
    public async getMenuPorFecha(
        fecha: string, 
        limit: number, 
        offset: number, 
        id_visita: number = 0 
    ): Promise<{ platos: any[] }> {
        try {
            // Incluimos el id_visita en la URL como Query Param
            const url = `${Api.apiUrl}/menu-dia?fecha=${fecha}&limit=${limit}&offset=${offset}&id_visita=${id_visita}`;

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


 public async getComandaDetalladaPorFecha(fecha: string, idAula: number): Promise<any[]> {
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
    public async downloadComandaPDF(fecha: string): Promise<string | null> {
    try {
        const url = `${Api.apiUrl}/comanda/descargar-pdf?fecha=${fecha}`;

        // 📌 SOLO móvil
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            const fileUri = `${FileSystem.documentDirectory}comanda_${fecha}.pdf`;

            const downloadRes = await FileSystem.downloadAsync(url, fileUri);

            if (downloadRes.status !== 200) return null;
            return downloadRes.uri;
        }

        // 🌐 WEB → devolver la URL directamente
        if (Platform.OS === 'web') {
            return url;
        }

        return null;

    } catch (error) {
        console.error("Error descargando PDF", error);
        return null;
    }
}
}
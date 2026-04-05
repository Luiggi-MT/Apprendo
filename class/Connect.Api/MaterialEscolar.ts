import { MaterialEscolar, materialEscolarResponse } from "../Interface/MaterialEscolar";
import { MaterialEscolarSend } from "../Interface/MaterialEscolarSend";
import { Api } from "./Api";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
export class MaterialEscolarApi extends Api {
    // Devuelve null si todo fue bien, o el mensaje de error si falló
    public async createMaterialEscolar(materialData: MaterialEscolarSend): Promise<string | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/materiales-escolares`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(materialData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return errorData.error || `ERROR ${response.status}`;
            }
            return null;
        } catch (error) {
            return "ERROR DE CONEXIÓN CON EL SERVIDOR";
        }
    }

    public async getMaterialesEcolares(offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT): Promise<materialEscolarResponse> {
        try {
            const response = await fetch(`${Api.apiUrl}/materiales-escolares?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                return {
                    materialesEscolares: [],
                    offset,
                    count: 0,
                };
            }
            const data = await response.json();
            return {
                materialesEscolares: Array.isArray(data?.materialesEscolares) ? data.materialesEscolares : [],
                offset: typeof data?.offset === "number" ? data.offset : offset,
                count: typeof data?.count === "number" ? data.count : 0,
            };
        } catch (error) {
            return {
                materialesEscolares: [],
                offset,
                count: 0,
            };
        }
    }

    public async getMaterialesEscolaresByName(name: string, offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT): Promise<materialEscolarResponse | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/materiales-escolares/${encodeURIComponent(name)}?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            return {
                materialesEscolares: Array.isArray(data?.materialesEscolares) ? data.materialesEscolares : [],
                offset: typeof data?.offset === "number" ? data.offset : offset,
                count: typeof data?.count === "number" ? data.count : 0,
            };
        } catch (error) {
            return null;
        }
    }

    public async getMaterialEscolarById(id: number): Promise<MaterialEscolar | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/materiales-escolares/id/${id}`);
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            return data?.materialEscolar || null;
        } catch (error) {
            return null;
        }
    }

    public async updateMaterialEscolar(materialData: MaterialEscolarSend): Promise<string | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/materiales-escolares/${materialData.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(materialData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return errorData.error || `ERROR ${response.status}`;
            }
            return null;
        } catch (error) {
            return "ERROR DE CONEXIÓN CON EL SERVIDOR";
        }
    }

    public async deleteMaterialEscolar(id: number): Promise<string | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/materiales-escolares/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return errorData.error || `ERROR ${response.status}`;
            }
            return null;
        } catch (error) {
            return "ERROR DE CONEXIÓN CON EL SERVIDOR";
        }
    }

    public async downloadInventarioPDF(): Promise<string | null> {
        try {
            const url = `${Api.apiUrl}/materiales-escolares/inventario/pdf`;

            if (Platform.OS === "android" || Platform.OS === "ios") {
                const fileUri = `${FileSystem.documentDirectory}inventario_material_escolar.pdf`;
                const downloadRes = await FileSystem.downloadAsync(url, fileUri);

                if (downloadRes.status !== 200) {
                    return `ERROR ${downloadRes.status}`;
                }

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(downloadRes.uri);
                } else {
                    alert(`PDF descargado en: ${downloadRes.uri}`);
                }
                return null;
            }

            if (Platform.OS === "web") {
                const link = document.createElement("a");
                link.href = url;
                link.download = "inventario_material_escolar.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return null;
            }

            return null;
        } catch (error) {
            return "ERROR AL DESCARGAR EL INVENTARIO";
        }
    }

    public async seleccionadoMaterial(profesor_id: number, material_id: number, fecha: string): Promise<boolean> {
        try {
            const response = await fetch(`${Api.apiUrl}/material-seleccionado`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'profesor_id': profesor_id,
                    'material_id': material_id,
                    'fecha': fecha
                })
            });

            if (!response.ok) {
                return false;
            }
            const data = await response.json();
            return data?.seleccionado || false;
        } catch (error) {
            return false;
        }
    }
}
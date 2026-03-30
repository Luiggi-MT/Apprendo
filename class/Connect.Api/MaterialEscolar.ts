import { MaterialEscolar, materialEscolarResponse } from "../Interface/MaterialEscolar";
import { MaterialEscolarSend } from "../Interface/MaterialEscolarSend";
import { Api } from "./Api";
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

    public async updateMaterialEscolar(id: number, materialData: MaterialEscolarSend): Promise<string | null> {
        try {
            const response = await fetch(`${Api.apiUrl}/materiales-escolares/${id}`, {
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
}
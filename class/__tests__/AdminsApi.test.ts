import { AdminsApi } from "../Connect.Api/AdminsApi";
import { User } from "../Interface/User";

describe("AdminsApi - getAdmins", () => {
    const api = new AdminsApi(); 
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    it("Devuelve la lista de admins cuando la respuesta es correcta", async () => {
        const mockAdmins: User[] = [
            {
                foto: "nombre foto", 
                username: "admin",
            },
        ];
        fetchMock.mockResponseOnce(JSON.stringify(mockAdmins));
        const result = await api.getAdmins();
        expect(fetchMock).toHaveBeenCalledTimes(1); // Comprueba que fetch se llamo una vez
        expect(fetchMock).toHaveBeenCalledWith( `${api.getUrl()}/admins`); // fetch fue llamado con url correcta
        expect(result).toEqual(mockAdmins); // comprueba que el valor es el valor que esperamos
    });

    it("Entra en el cath si fetch falla (error de red)", async () => {
        fetchMock.mockRejectOnce(new Error("Network error"));
        const result = await api.getAdmins(); 
        expect(result).toEqual([]);
    });

    it("Devuelve ok false", async() => {
        const mockAdmins = ['internal Server Error', {status: 500}]
        fetchMock.mockResponseOnce(JSON.stringify(mockAdmins));
        const result = await api.getAdmins();
        expect(fetchMock).toHaveBeenCalledTimes(1); 
        expect(fetchMock).toHaveBeenCalledWith(`${api.getUrl()}/admins`); 
        expect(result).toEqual(mockAdmins);
    });
});
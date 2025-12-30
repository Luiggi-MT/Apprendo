import { AdminsApi } from "../Connect.Api/AdminsApi";

describe("AdminsApi - getAdmins", () => {
    const api = new AdminsApi(); 
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    it("Devuelve la lista de admins cuando la respuesta es correcta", async () => {
        const mockAdmins = ["admin1"];
        fetchMock.mockResponseOnce(JSON.stringify(mockAdmins));
        const result = await api.getAdmins();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith( `${api.getUrl()}/admins`);
        expect(result).toEqual(mockAdmins);
    });
});
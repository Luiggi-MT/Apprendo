import { Login } from "../Connect.Api/Login";
import { ApiResponse } from "../Interface/ApiResponse";
import { LoginResponse } from "../Interface/LoginResponse";
describe("Login - loginUser", () => {
    const api = new Login();
    beforeEach(() => {
        fetchMock.resetMocks();
    }); 
    it("Inico de sesión correcto", async () => {
        const mokeResponse: LoginResponse = {
            message: "Inicio sesión correcto",
            username: "admin",
            foto: "foto",
            tipo: "admin",
        }
        fetchMock.mockResponseOnce(JSON.stringify(mokeResponse));
        const result = await api.loginUser("admin", "1234");
        expect(fetchMock).toHaveBeenCalledWith(
            `${api.getUrl()}/login`,
            expect.objectContaining({
                method: "POST", 
                headers: {'Content-Type': 'application/json'}, 
                credentials: 'include', 
            })); 
        expect(result).toEqual({
            ...mokeResponse, 
            ok: true,
        })
    });
    it("Fallo en el inicio de sesion", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({error: "Credenciales incorrectas"}), 
            {status: 401}
        );
        const result = await api.loginUser("usuario", "contraseña");
        expect(fetchMock).toHaveBeenCalledWith(
            `${api.getUrl()}/login`, 
            expect.objectContaining({
                method: "POST", 
                headers: {"Content-Type": "application/json"}, 
                credentials: "include",
            })
        ); 
        expect(result).toEqual({
            ok: false, 
            message: "Credenciales incorrectas"
        });
    });

    it("Error de conexión", async () => {
        fetchMock.mockRejectOnce(new Error("network error"));
        const result = await api.loginUser("usuario", "contraseña");
        expect(result).toEqual({
            ok: false, 
            message: "Error de red: No se pudo conectar al servidor. (network error)"
        });
    });
});
describe("Login - logOutUser", () => {
    const api = new Login(); 
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    it("Terminar sesión", async () => {
        fetchMock.mockResponseOnce("", {status: 200});
        const result = await api.logoutUser(); 
        expect(fetchMock).toHaveBeenCalledWith(
            `${api.getUrl()}/logout`, 
            expect.objectContaining({
                method: "POST", 
                credentials: "include"
            })
        );
        expect(result).toBe(true);
    });
    it("Fallo al terminar sesión", async () => {
        fetchMock.mockResponseOnce("", {status: 500}); 
        const result = await api.logoutUser();
        expect(fetchMock).toHaveBeenCalledWith(
            `${api.getUrl()}/logout`, 
            expect.objectContaining({
                method: "POST", 
                credentials: "include"
            })
        );
        expect(result).toBe(false);

    });
    it("Fallo conexión", async () => {
        fetchMock.mockRejectOnce(new Error("network error"));
        const result = await api.logoutUser();
        expect(result).toBe(false);
    });
});
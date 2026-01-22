import { Login } from "../Connect.Api/Login";
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
                credentials: "include",
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

describe("Login - checkSession", () => {
    const api = new Login(); 
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    it("Retorna true y los datos del usuario", async () => {
        const mockUserData = { id: 1, username: "Usuario", foto: "porDefecto.png"};
        fetchMock.mockResponseOnce(JSON.stringify(mockUserData), {status: 200});
        const result = await api.checkSession(); 
        expect(result.ok).toBe(true);
        expect(result.username).toBe("Usuario");
        expect(result.foto).toBe("porDefecto.png");
        expect(fetchMock).toHaveBeenCalledWith(
            `${api.getUrl()}/session`, 
            expect.objectContaining({
                method: "GET",
                credentials: "include", 
                mode:"cors", 
                headers: {"Content-Type" : "application/json"}
            })
        )
    });
    it("Respuesta de status 401", async () => {
        fetchMock.mockResponseOnce("", {status: 401}); 
        const result = await api.checkSession();
        expect(result.ok).toBe(false); 
        expect(result.message).toBe("No active session");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it("Respuesta de status diferente", async () =>{
        const statusError = 402;
        fetchMock.mockResponseOnce("",  {status: statusError});
        const result = await api.checkSession(); 
        expect(result.ok).toBe(false);
        expect(result.message).toBe(`Session check failed with status ${statusError}`);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    }); 
    it("Salta el catch", async () => {
        const error = "network work"
        fetchMock.mockRejectOnce(new Error(error));
        const result = await api.checkSession(); 
        expect(result.ok).toBe(false);
        expect(result.message).toBe(`Error checking session: ${error}`);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
describe("Login - loginStudent", () => {
    const api = new Login(); 
    
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("Inicio de sesión exitoso", async () => {
        // 1. Definimos los datos de entrada (Mock Input)
        const studentId = 123;
        const passType = "image";
        const mockResponse = { 
            id: 123, 
            username: "Juanito", 
            role: "student",
            avatar: "avatar1.png" 
        };

        // 2. Configuramos el mock para devolver 200 OK y el JSON del estudiante
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        // 3. Ejecutamos la función con datos de prueba
        const result = await api.loginStudent(studentId, passType);

        // 4. Aserciones
        expect(result.ok).toBe(true);
        expect(result.username).toBe("Juanito");
        
        // Verificamos que el body enviado al fetch sea el correcto
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/login_student'),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    id: studentId,
                    password: undefined, // En este caso no mandamos password
                    tipoContraseña: passType,
                    passwordImage: undefined,
                    distractor: undefined
                })
            })
        );
    });

    it("Error cuando el servidor devuelve un error de validación (400/401)", async () => {
        const errorMsg = "Credenciales incorrectas";
        fetchMock.mockResponseOnce(JSON.stringify({ error: errorMsg }), { status: 401 });

        const result = await api.loginStudent(1, "text", "wrong_pass");

        expect(result.ok).toBe(false);
        expect(result.message).toBe(errorMsg);
    });
});
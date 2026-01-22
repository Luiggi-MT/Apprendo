
import { Platform } from "react-native";
import { StudentsApi } from "../Connect.Api/StudentsApi";

describe("StudentsApi", () => {
    let api: StudentsApi;

    beforeEach(() => {
        fetchMock.resetMocks();
        api = new StudentsApi();
    });

    // --- TESTS DE LECTURA (GET) ---
    describe("getStudents", () => {
        it("debe retornar la lista de estudiantes cuando la respuesta es 200", async () => {
            const mockData = { ok: true, students: [{ id: 1, nombre: "Juan" }], offset: 0, count: 1 };
            fetchMock.mockResponseOnce(JSON.stringify(mockData));

            const result = await api.getStudents();

            expect(result.ok).toBe(true);
            expect(result.students).toHaveLength(1);
            expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/students?offset="));
        });

        it("debe retornar un objeto vacío y ok: false si falla la red", async () => {
            fetchMock.mockReject(new Error("Network Error"));

            const result = await api.getStudents();

            expect(result.ok).toBe(false);
            expect(result.students).toEqual([]);
        });
    });

    // --- TESTS DE CREACIÓN (FLUJOS COMPLEJOS) ---
    describe("createStudent", () => {
        const mockStudent: any = { id: 10, nombre: "Test", foto: "porDefecto.png", tipoContraseña: "texto" };

        it("debe crear un estudiante exitosamente (caso simple sin fotos)", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ id: 10, ok: true }), { status: 201 });

            const result = await api.createStudent(mockStudent, [], []);

            expect(result.ok).toBe(true);
            expect(result.message).toBe("Estudiante creado correctamente");
        });

        it("debe retornar error si el servidor devuelve un error en el POST inicial", async () => {
            fetchMock.mockResponseOnce(JSON.stringify("Error de validación"), { status: 400 });

            const result = await api.createStudent(mockStudent, [], []);

            expect(result.ok).toBe(false);
            expect(result.message).toBe("Error de validación");
        });
    });

    // --- TESTS DE ELIMINACIÓN ---
    describe("deleteStudent", () => {
        it("debe eliminar correctamente", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

            const result = await api.deleteStudent("Juan");

            expect(result.ok).toBe(true);
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining("/student/Juan"),
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });

    // --- TESTS DE FOTOS Y PLATAFORMAS ---
    describe("uploadStudentPhoto", () => {
        it("debe construir FormData correctamente en Android/iOS", async () => {
            // Forzamos que no sea Web para esta prueba
            Platform.OS = 'android';
            
            fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));

            // Usamos 'as any' para acceder al método privado o lo testeamos a través de createStudent
            // Aquí lo probaremos mediante una respuesta simulada
            const result = await (api as any).uploadStudentPhoto(1, "file://path/photo.jpg");

            expect(result.ok).toBe(true);
            const formData = fetchMock.mock.calls[0][1]?.body as any;
            // Verificamos que se haya adjuntado el objeto con uri
            expect(formData).toBeDefined();
        });
    });
});
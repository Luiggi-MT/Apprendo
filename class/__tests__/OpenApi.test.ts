import { OpenAI } from "../Connect.Api/OpenAi";


describe("OpenAI - enviarAudio", () => {
    let openAi: OpenAI;

    beforeEach(() => {
        fetchMock.resetMocks();
        openAi = new OpenAI();
    });

    it("debe enviar el audio correctamente y retornar el texto transcrito", async () => {
        // 1. Mock de la respuesta
        const mockResponse = { text: "Hola, esto es una prueba de voz." };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        const uri = "file://path/to/audio/voz.m4a";
    
        // 2. Ejecución
        const result = await openAi.enviarAudio(uri);

        // 3. Aserciones
        expect(result).toBe("Hola, esto es una prueba de voz.");
    
        // Verificamos la llamada al fetch
        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/speech-to-text'),
            expect.objectContaining({
                method: "POST",
                body: expect.any(FormData) 
            })
        );

        // 4. Verificación del contenido de FormData (Forma segura)
        const calledFormData = fetchMock.mock.calls[0][1]?.body as FormData;
    
        // Nota: En Jest/JSDOM, FormData no es fácilmente iterable, 
        // pero podemos verificar que el body existe y es del tipo correcto.
        expect(calledFormData).toBeInstanceOf(FormData);
    });

    it("debe fallar si la respuesta del servidor es un error", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: "Invalid audio" }), { status: 400 });

        // Dependiendo de si quieres que tu función lance error o no, 
        // aquí podrías esperar un throw o un resultado específico.
        // Actualmente tu código hace response.json() directamente.
        await expect(openAi.enviarAudio("uri-falsa")).resolves.toBeUndefined(); 
        // Nota: Si data.text no existe, devolverá undefined según tu implementación actual.
    });

    it("debe lanzar una excepción si hay un error de red", async () => {
        fetchMock.mockReject(new Error("Network Error"));

        await expect(openAi.enviarAudio("uri-falsa")).rejects.toThrow("Network Error");
    });
});
import { ApiResponse } from "../Interface/ApiResponse";
import { ApiResponseStudents } from "../Interface/ApiResponseStudents";
import { ImagePassword } from "../Interface/ImagePassword";
import { Students } from "../Interface/Students";
import { Api } from "./Api";
import { Platform } from 'react-native';


export class StudentsApi extends Api{
    
    
    public async getStudents(offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT): Promise<ApiResponseStudents> {
        try{
            const response = await fetch(`${Api.apiUrl}/students?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data:ApiResponseStudents = await response.json();
            return data;
        }catch{
            console.error("Failed to fetch students");
            return { ok: false, students: [], offset: 0, count: 0 };
        }
    }
    
    public async getEstudentByName(name: string, offset: number = Api.INITIAL_OFFSET, limit: number = Api.LIMIT): Promise<ApiResponseStudents | null> {
        try{
            const response = await fetch(`${Api.apiUrl}/students/${name}?offset=${offset}&limit=${limit}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data: ApiResponseStudents = await response.json();
            return data;
        }catch{
            console.error("Failed to fetch student by name");
            return null;
        }
    }


    public async createStudent(student: Students, password: ImagePassword[], distractor: ImagePassword[]): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/student`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(student)
            });
            if (!response.ok){
                const errorData = await response.json(); 
                return {
                    ok: false, 
                    message: errorData
                }; 
            }
            const data = await response.json()
            const responseFotoPerfil = await this.uploadStudentPhoto(data.id, student.foto);
            if(!responseFotoPerfil.ok){
                return {
                    ok: false, 
                    message: "Fallo a la hora de subir la foto de perfil",
                } 
            }
            if(password.length !== 0 && distractor.length !== 0){
                console.log(JSON.stringify(password, null, 2));
                console.log(JSON.stringify(distractor, null, 2));
                const responseFotoPassword = await this.sendPasswordImage(password, data.id);
                const responseFotoDistractor = await this.sendPasswordImage(distractor, data.id);
                if(!responseFotoPassword.ok || !responseFotoDistractor.ok){
                    return {
                        ok: false, 
                        message: "Ha habido un error al subir la fotos de la contraseña"
                    }
                }
            }
            return {ok: true, message: "Estudiante creado correctamente"};
        }catch(error){
            return {ok: false, message: error};
        }
    }
    public async updateStudent(student: Students, password:ImagePassword[], distractor: ImagePassword[]): Promise<ApiResponse>{
        try{
            
            const response = await fetch(`${Api.apiUrl}/student/${student.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(student)
            });
            const data = await response.json();
            if (!response.ok){
                if(student.foto) {
                    const response = await this.uploadStudentPhoto(student.id, student.foto);
                    if (response.ok) return response;
                }
                const errorData = await response.json(); 
                return {
                    ok: false, 
                    message: errorData
                }; 
            }
            if(student.foto) this.uploadStudentPhoto(student.id, student.foto);
            if(password && distractor){
                const responseFotoPassword = await this.sendPasswordImage(password, student.id);
                const responseFotoDistractor = await this.sendPasswordImage(distractor, student.id);
                if(!responseFotoPassword.ok || !responseFotoDistractor.ok){
                    return {
                        ok: false, 
                        message: "Ha habido un error al subir la fotos de la image"
                    }
                }
            }
            return {ok: true, message: "Estudiante actualizado correctamente"};
        }catch(error){
            return {ok: false, message: error};
        }
    }

    private async uploadStudentPhoto(id: number, imageUri: string): Promise<ApiResponse> {
        const formData = new FormData();

        if (Platform.OS === 'web') {
            // 🌐 WEB → convertir URI a File
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const file = new File([blob], 'photo.jpg', { type: blob.type });

            formData.append('photo', file);
        } else {
            // 📱 ANDROID / IOS
            const filename = imageUri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append('photo', {
                uri: imageUri,
                name: filename,
                type,
            } as any);
        }

        try {
            const response = await fetch(`${Api.apiUrl}/student/${id}/photo`,
            {
                method: 'POST',
                body: formData,
                // ❌ NO headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { ok: false, message: errorData };
            }

            return { ok: true, message: 'Foto subida correctamente' };

        } catch (error) {
            return { ok: false, message: error };
        }
    }


    public async deleteStudent(name: string): Promise<ApiResponse>{
        try{
            const response = await fetch(`${Api.apiUrl}/student/${name}`, {
            method: 'DELETE', 
            headers: {'Content-Type': 'application/jason'}
            });
            if (!response.ok){
                const errorData = await response.json(); 
                return {
                    ok: false, 
                    message: errorData
                }; 
            }
            return {ok: true, message: "Estudiante eliminado correctamente"};
        }catch(error){
            return {ok: false, message: error};
        }
    }

    private async sendPasswordImage(images: ImagePassword[], id: number): Promise<ApiResponse> {
        try {
            if (images.length === 0) {
                return {
                    ok: false,
                    message: 'Selecciona al menos una imagen de cada tipo',
                };
            }

            for (const image of images) {
                const formData = new FormData();

                if (Platform.OS === 'web') {
                    // 🌐 WEB
                    const response = await fetch(image.uri);
                    const blob = await response.blob();

                    const file = new File([blob], 'password.jpg', {
                        type: blob.type || 'image/jpeg',
                    });

                    formData.append('photo', file);
                } else {
                    // 📱 ANDROID / IOS
                    const filename = image.uri.split('/').pop() || 'password.jpg';
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : `image/jpeg`;

                    formData.append('photo', {
                        uri: image.uri,
                        name: filename,
                        type,
                    } as any);
                }

                formData.append('codigo', image.codigo);
                formData.append('id_estudiante', id.toString());
                formData.append('es_contraseña', image.es_contraseña ? 'true' : 'false');

                const response = await fetch(`${Api.apiUrl}/student/${id}/image-password`,
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            Accept: 'application/json',
                        },
                    });

                if (!response.ok) {
                    const error = await response.text();
                    return {
                        ok: false,
                        message: error,
                    };
                }
            }

            return {
                ok: true,
                message: 'Fotos subidas exitosamente',
            };

        } catch (error) {
            return {
                ok: false,
                message: error,
            };
        }
    }

    public async setPasswordImage(password: ImagePassword[], distractor: ImagePassword[], id: number): Promise<ApiResponse>{
        const responsePassword = await this.sendPasswordImage(password, id);
        const responseDistractor = await this.sendPasswordImage(distractor, id);

        if(responsePassword.ok && responseDistractor.ok){
            return{
                ok: true, 
                message: "Se han subido las imagenes de forma exitosa",
            }
        }
        return{
            ok: false, 
            message: "Ha ocurrido un error la subir las imagenes",
        }
    }

    public async getImagePassword(es_contraseña: boolean, id:number): Promise<ApiResponse>{
        let response: Response; 
        if(es_contraseña)
            response = await fetch(`${Api.apiUrl}/student/${id}/es-contraseña`);
        else response = await fetch(`${Api.apiUrl}/student/${id}/no-es-contraseña`)
            
        if(!response.ok){
            return{
                ok: false, 
                message: "Ha ocurrido un error",
            }
        }
        const datas = await response.json();
        const imagenesModificadas = datas.message.map((item: any) => {
            return {
                ...item,
                uri: `${Api.apiUrl}/foto-password/${item.uri}`
            }
            }
        )
        return{
            ok: true, 
            message: imagenesModificadas,
        }
    }
}
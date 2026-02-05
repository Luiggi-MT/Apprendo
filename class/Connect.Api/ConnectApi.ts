import { ApiResponse } from "../Interface/ApiResponse";
import { ApiResponseStudents } from "../Interface/ApiResponseStudents";
import { ImagePassword } from "../Interface/ImagePassword";
import { LoginResponse } from "../Interface/LoginResponse";
import { Students } from "../Interface/Students";
import { User } from "../Interface/User";
import { AdminsApi } from "./AdminsApi";
import { Api } from "./Api";
import { ComponentApi } from "./ComponentApi";
import { FotoApi } from "./FotoApi";
import { Login } from "./Login";
import { OpenAI } from "./OpenAi";
import { StudentsApi } from "./StudentsApi";
import { LoginResponseStudnet } from "../Interface/LoginResponseStudent";
import { Menu } from "./Menu";
import { ApiResponseMenu } from "../Interface/ApiResponseMenu";
import { AulaApi } from "./AulaApi";
import { ApiResponseAulas } from "../Interface/ApiResponseAulas";
import { ProfesorApi } from "./Profesor";
import { ApiResponseProfesor } from "../Interface/ApiResponseProfesor";
import { Aula } from "../Interface/Aula";
import { Profesor } from "../Interface/Profesor";
import { TareasApi } from "./Tareas";
import { ApiResponseTareas } from "../Interface/ApiResponseTareas";
import { Comanda } from "./Comanda";


export class ConnectApi {
    
    private api: Api;  
    private student: StudentsApi; 
    private admin: AdminsApi; 
    private profesores: ProfesorApi;
    private component: ComponentApi; 
    private foto: FotoApi; 
    private login: Login; 
    private openAI: OpenAI;
    private menu: Menu; 
    private aula: AulaApi;
    private tarea: TareasApi; 
    private comanda: Comanda;
    
    constructor(){
        this.api = new Api(); 
        this.student = new StudentsApi(); 
        this.admin = new AdminsApi(); 
        this.profesores = new ProfesorApi();
        this.component = new ComponentApi(); 
        this.foto = new FotoApi(); 
        this.login = new Login(); 
        this.openAI = new OpenAI();
        this.menu = new Menu();
        this.aula = new AulaApi();
        this.tarea = new TareasApi();
        this.comanda = new Comanda();
    
        
    }
    // APi
    public getLimit(): number{
        return this.api.getLimit();
    }

    public getInitial_offset(): number{
        return this.api.getInitial_offset();
    }

    public getUrl(): string{
        return this.api.getApiUrl();
    }

    // Estudiantes 
    public async getStudents(offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit()): Promise<ApiResponseStudents> {
            return this.student.getStudents(offset,limit);
        }
        
    public async getEstudentByName(name: string, offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit()): Promise<ApiResponseStudents | null>{
        return this.student.getEstudentByName(name, offset, limit);
    } 
        
    public async createStudent(student: Students, password: ImagePassword[], distractor: ImagePassword[]): Promise<ApiResponse>{
        return this.student.createStudent(student, password, distractor);
    }
    public async updateStudent(student: Students, password: ImagePassword[], distractor: ImagePassword[]): Promise<ApiResponse>{
        return this.student.updateStudent(student, password, distractor);
    }
    
    public async deleteStudent(name: string): Promise<ApiResponse>{
        return this.student.deleteStudent(name);
    }

    public async setPasswordImage(password: ImagePassword[], distractor: ImagePassword[], id: number): Promise<ApiResponse>{
        return this.student.setPasswordImage(password, distractor, id);
    }

    public async getImagePassword(id: number): Promise<ApiResponse>{
        return this.student.getImagePassword(id);
    }

    //Profesores
    public async getProfesores(offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit()): Promise<ApiResponseProfesor> {
        return this.profesores.getProfesores(offset,limit);
    }

    public async getProfesorById(id: number): Promise<Profesor>{
        return this.profesores.getProfesorById(id);
    }

    public async createProfesor(username: string, palabraClabe: string): Promise<boolean>{
        return this.profesores.createProfesor(username, palabraClabe);
    }

    public async setContraseña(username: string, password: string, palabraClabe: string): Promise<ApiResponse>{
        return this.profesores.setContraseña(username, password, palabraClabe);
    }

    //Admin
    public async getAdmins(): Promise<User[]> {
        return this.admin.getAdmins();
    }

    //Components
    public getComponent(filename: string): string {
        return this.component.getComponent(filename);
    }

    //Fotos
    public getFoto(filename: string): string {
        return this.foto.getFoto(filename);
    }

    //Login 
    public async loginUser(userName: string, password: string): Promise<LoginResponse> {
        return this.login.loginUser(userName, password);     
    }

    public async loginStudent(id: number, tipoContraseña: string, password?: string, passwordImage?: ImagePassword[]) : Promise<LoginResponseStudnet>{
        return this.login.loginStudent(id, tipoContraseña, password, passwordImage);
    }

    public async logoutUser():Promise<boolean>{
        return this.login.logoutUser();
    }

    
    
    public async checkSession() : Promise<LoginResponse>{
        return this.login.checkSession();
    }



    //OpenAI
    public async enviarAudio(uri: string){
        return this.openAI.enviarAudio(uri);
    }

    // Menu
    public async getMenu(offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit(), fecha: string): Promise<ApiResponseMenu>{
        return this.menu.getMenu(offset, limit, fecha);
    }

    public async createMenu(fecha: string, pictogramaMenuId: number, tachado: boolean, descripcion: string, primerPlato: string, primerPlatoId: number, segundoPlato: string, segundoPlatoId: number, guarnicion: string, guarnicionId: number, postre: string, postreId: number): Promise<ApiResponse>{
        return this.menu.createMenu(fecha, pictogramaMenuId, tachado, descripcion, primerPlato, primerPlatoId, segundoPlato, segundoPlatoId, guarnicion, guarnicionId, postre, postreId);
    }

    public async getMenuById(menu_id: number): Promise<ApiResponseMenu>{
        return this.menu.getMenuById(menu_id);
    }

    public async updateMenuById(menu_id: number, fecha: string, pictogramaMenuId: number, tachado: boolean, descripcion: string, primerPlato: string, primerPlatoId: number, segundoPlato: string, segundoPlatoId: number, guarnicion: string, guarnicionId: number, postre: string, postreId: number): Promise<ApiResponse>{
        return this.menu.updateMenuById( menu_id, fecha, pictogramaMenuId, tachado, descripcion, primerPlato, primerPlatoId, segundoPlato, segundoPlatoId, guarnicion, guarnicionId, postre, postreId);
    }

    //Aula
    public async getAulas(offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit()): Promise<ApiResponseAulas> {
        return this.aula.getAulas(offset,limit);
    }

    public async createAula(name: string): Promise<boolean>{
        return this.aula.createAula(name);
    }

    public async getAulaByName(name: string, offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit()): Promise<ApiResponseAulas | null>{
        return this.aula.getAulaByName(name, offset, limit);
    }

    public async getAulaById(id: number): Promise<Aula> {
        return this.aula.getAulaById(id);
    }

    public async asignarProfesorAula(profesorId: number, aulaId: number): Promise<boolean>{
        return this.aula.asignarProfesorAula(profesorId, aulaId);
    }

    public async desasignarProfesorAula(profesorId: number, aulaId: number): Promise<boolean>{
        return this.aula.desasignarProfesorAula(profesorId, aulaId);
    }

    public async deletaAula(aulaId: number): Promise<boolean>{
        return this.aula.deletaAula(aulaId);
    }

    // Tareas
    public async getTareas(offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit()): Promise<ApiResponseTareas>{
        return this.tarea.getTareas(offset, limit);
    }

    public async getTareaComanda(): Promise<boolean>{
        return this.tarea.getTareaComanda();
    }

    public async createTareaComanda(uri: number, titulo: string, id_profesor: number): Promise<boolean>{
        return this.tarea.createTareaComanda(uri, titulo, id_profesor);
    }

    public async deleteTareaComanda(): Promise<boolean> {
        return this.tarea.deleteTareaComanda();
    }

    public async asignarTarea(tareaId: number, studentId: number, fechaInicio: string, fechaFin: string): Promise<boolean> {
        return this.tarea.asignarTarea(tareaId, studentId, fechaInicio, fechaFin);
    }
    public async getTareaEstudiante(estudianteId: number, offset: number = this.api.getInitial_offset(), limit: number = this.api.getLimit(), fecha: string): Promise<ApiResponseTareas>{
        return this.tarea.getTareaEstudiante(estudianteId, offset, limit, fecha);
    }
    public async getResumenMensual(estudianteId: number, mes: string): Promise<Record<string, { todas_hechas: boolean }>> {
        return this.tarea.getResumenMensual(estudianteId, mes);
    }

    public async finalizarTarea(id: number): Promise<boolean>{
        return this.tarea.finalizarTarea(id);
    }

    //Comanda
    public async getDetalleComanda(id_tarea_estudiante: number): Promise<{ aulas: any[], menu_del_dia: any[] } | null> {
        return this.comanda.getDetalleComanda(id_tarea_estudiante);
    }

    public async getMenuPorFecha(fecha: string, limit: number, offset: number, id_visita: number = 0
    ): Promise<{ platos: any[] }> {
        return this.comanda.getMenuPorFecha(fecha, limit, offset, id_visita);
    }

    
    public async guardarVisitaAula(id_visita: number, pedidos: any[]): Promise<boolean> {
        return this.comanda.guardarVisitaAula(id_visita, pedidos);
    }

    public async getAulasComandaPorFecha(fecha: string, offset: number, limit: number): Promise<any[]> {
        return this.comanda.getAulasComandaPorFecha(fecha, offset, limit);
    }

    public async getComandaDetalladaPorFecha(fecha: string, idAula: number): Promise<any[]> {
        return this.comanda.getComandaDetalladaPorFecha(fecha, idAula); 
    }
    public async downloadComandaPDF(fecha:string): Promise<string | null>{
        return this.comanda.downloadComandaPDF(fecha);
    }
    
}

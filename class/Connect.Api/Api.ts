export class Api {
    //protected static apiUrl: string = "http://192.168.1.140:5000";
    //protected static apiUrl: string = "http://localhost/api";
    protected static apiUrl: string = "http://3.122.246.141/api"
    protected static readonly LIMIT: number = 6;
    protected static readonly INITIAL_OFFSET: number = 0;
    constructor() {
        //this.apiUrl = "http://localhost/api";
    }

    public getLimit(): number {
        return Api.LIMIT;
    }
    public getInitial_offset(): number{
        return Api.INITIAL_OFFSET;
    }
    public getUrl(): string{
        return Api.apiUrl;
    }
    
    
}
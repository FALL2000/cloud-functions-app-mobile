export class Response {
    code:string;
    message:string;
    body:any;
    constructor(code:string, message:string, body:any){
        this.code = code;
        this.message= message;
        this.body = body;
    }
}
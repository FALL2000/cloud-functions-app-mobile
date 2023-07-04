export class Response {
    code:string='';
    message:string='';
    body:any;
    exit:any;
    constructor(){
        this.exit ='OK';
        this.code ='200';
        this.message="NOT RECOGNIZED"
    }
    public static  error(error:any):Response{
        const error_response = new Response();
        error_response.code= error?.code || 'internal';
        error_response.message=error?.message;
        error_response.exit ='KO';
        return error_response
    }
}
export class mutex{
    id: string;
    isRunning: boolean;
    constructor(id: string, isRunning: boolean){
        this.id=id;
        this.isRunning=isRunning;
    }
    public toSave():any{
        const {id,...rest}=this;
        return rest;
    }
}
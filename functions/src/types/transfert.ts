export class Transfert{
    amount:number=0;
    inZoneId:string='';
    outZoneId:string='';

    public checkfeasibility():boolean{
        return true
    }
    public static buildRequest(req:any): Transfert{
        const _req= new Transfert()

        return _req
    }
}
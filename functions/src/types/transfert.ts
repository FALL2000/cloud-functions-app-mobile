export class Transfert {
    id:string='';
    amount:number=0;
    inZoneId:string='';
    outZoneId:string='';
    currency:string='';
   
    /*constructor(id:string, amount:number, inZone:string, outZone:string, currency:string){
        this.id = id;
        this.amount=amount;
        this.inZone=inZone;
        this.outZone=outZone;
        this.currency=currency;
    }*/

    public checkfeasibility():boolean{
        return true
    }
    public static buildRequest(req:any): Transfert{
        const _req= new Transfert()

        return _req
    }
    public owner:any={};

    
}
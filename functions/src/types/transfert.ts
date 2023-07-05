export class Transfert {
    id:string='';
    amount:number=0;
    inZoneId:string='';
    outZoneId:string='';
    currency:string='';
    ownerId:string='';
   
    /*constructor(id:string, amount:number, inZone:string, outZone:string, currency:string){
        this.id = id;
        this.amount=amount;
        this.inZone=inZone;
        this.outZone=outZone;
        this.currency=currency;
    }*/

    public checkfeasibility():boolean{
        if(this.amount && this.amount > 0 && this.inZoneId != this.outZoneId){
            return true;
        }else{
            return false;
        }
    }
    public static buildRequest(req:any): Transfert{
        const _req= new Transfert()
        _req.amount = req.amount;
        _req.id = req.id;
        _req.inZoneId = req.inZone.country.code;
        _req.outZoneId = req.outZone.country.code;
        _req.currency = req.outZone.country.currency;
        _req.ownerId = req.ownerId;
        return _req;
    }
}
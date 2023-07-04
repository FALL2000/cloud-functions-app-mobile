export class Transfert {
    id:string;
    amount:number;
    inZone:string;
    outZone:string;
    currency:string;
   
    constructor(id:string, amount:number, inZone:string, outZone:string, currency:string){
        this.id = id;
        this.amount=amount;
        this.inZone=inZone;
        this.outZone=outZone;
        this.currency=currency;
    }

}
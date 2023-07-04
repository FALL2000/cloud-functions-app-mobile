export class Transfert {
<<<<<<< HEAD
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
=======
    status:string= '';
    amount:any;
    description:string='';
    createdDate:any;
    LastTimeInPending:any;
    to_bank:boolean= false;
    bank:any;
    receiver:any;
    deposit:any={};
    ownerId:string='';
    inZone:any;
    outZone:any;
    codeReception:string='';
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
    public owner:any={};

    public fromJson(transfert:any){
        if(transfert.status){
            if(statut.includes(transfert.status)){
                this.status = transfert.status;
            }else{
                throw new functions.https.HttpsError('failed-precondition', 'Status is not valid');
            }
        }
        if(transfert.amount != null){
            if(transfert.amount > 0){
                this.amount = transfert.amount;
            }else{
                throw new functions.https.HttpsError('failed-precondition', 'Amount must be greater than 0');
            }
        }
        if(transfert.description){
            this.description = transfert.description;
        }
        if(transfert.createdDate){
            this.createdDate = Timestamp.fromDate(new Date(transfert.createdDate));
            this.LastTimeInPending = Timestamp.fromDate(new Date(transfert.createdDate));
        }
        if(transfert.bank){
            this.to_bank = true;
            this.bank = transfert.bank;
        }
        if(transfert.receiver){
            this.receiver = transfert.receiver;
        }
        if(transfert.deposit){
            this.deposit = transfert.deposit;
        }
        if(transfert.codeReception){
            this.codeReception = transfert.codeReception;
        }
    }

    public setOwnerId(ownerId:any){
        this.ownerId = ownerId;
    }

    public setInZone(inZoneCity:any){
        this.inZone = inZoneCity;
    }

    public setOutZone(outZoneCity:any){
        this.outZone = outZoneCity;
>>>>>>> 184eb15add054de5dc110a02ad04a7dfa5e88160
    }
}
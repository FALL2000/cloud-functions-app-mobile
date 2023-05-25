import { Timestamp } from "firebase-admin/firestore";
export class Transfert {
    currency:string='';
    status:string= 'OPEN';
    amount:number=0;
    description:string='';
    createdDate:any;
    LastTimeInPending:any;
    to_bank:boolean= false;
    bank:any;
    receiver:any;
    deposit:any={};
    ownerId:string='';
    owner:any={};
    inZoneId:string=''; //code du pays de reception
    outZoneId:string=''; //code du pays d'envoi
    inZoneCity:string=''; //code de la ville de reception
    outZoneCity:string=''; //code de la ville d'envoi
    inZone:any={};  //infos ville + pays de reception
    outZone:any={}; // infos ville + pays d'envoi
    codeReception:string='';

    public fromJson(transfert:any){
        this.currency = transfert.currency;
        this.amount = transfert.amount;
        this.description = transfert.description;
        this.createdDate = Timestamp.fromDate(new Date(transfert.createdDate));
        this.LastTimeInPending = Timestamp.fromDate(new Date(transfert.createdDate));
        if(transfert.bank){
            this.to_bank = true;
            this.bank = transfert.bank;
        }
        if(transfert.receiver){
            this.receiver = transfert.receiver;
        }
        this.deposit = transfert.deposit;
        this.inZoneId = transfert.inZoneId;
        this.outZoneId = transfert.outZoneId;
        this.outZoneCity = transfert.outZoneCity;
        this.inZoneCity = transfert.inZoneCity;
        this.codeReception = transfert.codeReception;
    }

    public setInZone(city:any){
      this.inZone = city;
    }

    public setOutZone(city:any){
        this.outZone = city;
    }

    public setOwner(owner:any){
        this.owner = owner;
    }

    public setOwnerId(ownerId:any){
        this.ownerId = ownerId;
    }

}
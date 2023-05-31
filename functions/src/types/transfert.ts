import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
const  statut = ["OPEN", "IN APPROVAL", "IN PROGRESS", "APPROVED", "CANCELED", "CLOSED WON"];
export class Transfert {
    status:string= '';
    amount:number=0;
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

    public fromJson(transfert:any){
        if(transfert.status){
            if(statut.includes(transfert.status)){
                this.status = transfert.status;
            }else{
                throw new functions.https.HttpsError('failed-precondition', 'Status is not valid');
            }
        }
        if(transfert.amount){
            this.amount = transfert.amount;
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
    }

}
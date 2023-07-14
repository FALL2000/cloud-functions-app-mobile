import * as functions from "firebase-functions";
import { StatusTranfert } from "../enum/status_enum";
const  statut = [StatusTranfert.Open, StatusTranfert.InApproval, StatusTranfert.InProgress, StatusTranfert.Approved, StatusTranfert.Canceled, StatusTranfert.ClosedWon];
export class Transfert {
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
import { StatusApproval } from "../enum/approval_status";
import { typeNotification } from "../enum/notif_type";
import { Transaction } from "./transaction";
import { Transfert } from "./transfert";

export class Approval {
    id:string;
    code:string;
    clientId:string;
    comment:string;
    notificationType?:typeNotification;
    fees:number=0;
    endDate:string;
    startDate:string;
    status:StatusApproval ;
    transfert?: Transfert;
    transaction?: Transaction;
    
    constructor(){
        this.id = "";
        this.comment = "new";
        this.code = 'APP-'+new Date().getTime();
        this.endDate = "";
        this.startDate = new Date().toJSON();
        this.status = StatusApproval.Open;
        this.clientId = "";
    }


    public static initApproval(transfert:Transfert,transaction: Transaction, isprimary:boolean):Approval{
        const _approval = new Approval()
        _approval.status = StatusApproval.InApproval;
        _approval.transfert = transfert;
        _approval.transaction = transaction;
        _approval.clientId = transfert?.ownerId;
        _approval.fees = Approval.calculatefees(transfert);
        (isprimary)? _approval.notificationType= typeNotification.Informative : typeNotification.Approbation
        return _approval
    }
    static calculatefees(transfert:Transfert):number{
        return transfert.amount * 0.2
    }
    public toSave():any{
        const {id,...rest}=this;
        return rest;
    }
    
}
import { StatusApproval } from "../enum/approval_status";
import { Transaction } from "./transaction";
import { Transfert } from "./transfert";

export class Approval {
    id:string;
    code:string;
    clientId:string;
    comment:string;
    code:string;
    endDate:string;
    startDate:string;
    status:StatusApproval ;
    transfert?: Transfert;
    transaction?: Transaction;
    
    constructor(){
        this.id = "";
        this.comment = "";
        this.code = 'APP-'+new Date().getTime();
        this.endDate = "";
        this.startDate = new Date().toJSON();
        this.status = StatusTransaction.Open;
        this.clientId = "";
    }


    public static initApproval(transfert:Transfert,transaction: Transaction):Approval{
        const _approval = new Approval()
        _approval.status = StatusTransaction.InApproval;
        _approval.matchingType = approval?.matchingType;

        "code":'APP-'+new Date().getTime(),
        "clientId":transfert.ownerId,
        "status":"SENDTOCLIENT",
        "startDate": new Date().toJSON(),
        "endDate":"test Bank",
        "fees":calculatefees(transfert),
        "vueClient":false,
        "comment":" newly created",
        isprimary,
        transaction,
        transfert
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
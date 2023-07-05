import { StatusTransaction } from "../enum/transaction_status";

export class Transaction {
    id:string;
    code:string;
    endDate:string;
    comment:string;
    matchingType:string;
    startDate:string;
    status:StatusTransaction ;
    
    constructor(){
        this.id = "";
        this.code = 'TRANS-'+new Date().getTime();
        this.endDate = "";
        this.matchingType = "";
        this.startDate = new Date().toJSON();
        this.status = StatusTransaction.Open
        this.comment = "";
    }


    public static initTransaction(transaction?:any):Transaction{
        const _transaction = new Transaction()
        _transaction.status = StatusTransaction.InApproval;
        _transaction.matchingType = transaction?.matchingType;
        return _transaction
    }
    public toSave():any{
        const {id,...rest}=this;
        return rest;
    }
    
}
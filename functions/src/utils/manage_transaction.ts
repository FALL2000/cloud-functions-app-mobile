
import { Firestore } from "firebase-admin/firestore";
import { Transfert } from "../types/transfert";
import { info} from "firebase-functions/logger";
import { Transaction } from "../types/transaction";
const TRANSFERT_COLLECTION=process.env.TRANSFERT_COLLECTION || 'transferts';
const TRANSACTION_COLLECTION = process.env.TRANSACTION_COLLECTION || 'Transaction';
const APPROVAL_COLLECTION=process.env.APPROVAL_COLLECTION || 'approvals';

export class TransactionManager{
    from?: string=''
    transferts: Transfert[]=[];
    public db:Firestore ;
    public constructor(db: Firestore,ListOfverifiedRequest: Transfert[],from?: string){
        this.db = db;
        this.transferts = ListOfverifiedRequest;
        this.from=from
    }
    public async openTransaction() {
        info(`@@@@...................in openTransaction `);
        // Create  related objects in order to open the transaction
        // Get a new write batch
        const batch = this.db.batch();
        const transaction= Transaction.initTransaction()
        
        // create transaction
        const transref = this.db.collection(TRANSACTION_COLLECTION).doc(transaction.code);
        batch.set(transref, transaction);
    
        // create prymary auth / update related transfert
        // const approval=buildApproval(transfert,transaction,isprimary)
        // const sfRef = this.db.collection(APPROVAL_COLLECTION).doc(approval.code);
        // batch.set(sfRef, approval);
    
        // const transfref = this.db.collection(APPROVAL_COLLECTION).doc(transfert.id);
        // batch.update(transfref, {"statut":"IN APPROVAL"});
        transferts.unshift(transfert);//put the base transfert at the top of list
        for (let index = 0; index < transferts.length; index++) {
            const _transfert=transferts[index];
            const approval=buildApproval(_transfert,transaction,(isprimary && (index==0) ))
            const sfRef = this.db.collection(APPROVAL_COLLECTION).doc(approval.code);
            batch.set(sfRef, approval);
        
            const transfref = this.db.collection(TRANSFERT_COLLECTION).doc(_transfert.id);
            batch.update(transfref, {"status":"IN APPROVAL"});
        }
    
        // Commit the batch
        await batch.commit();
        return transferts;
    };
}
const openTransaction =async (transferts:any[],transfert:any, isprimary:boolean=false) =>{
    info(`@@@@...................in openTransaction `);
    // Create  related objects in order to open the transaction
    // Get a new write batch
    const batch = this.db.batch();
    const transaction= Transaction.initTransaction()
    
    // create transaction
    const transref = this.db.collection(TRANSACTION_COLLECTION).doc(transaction.code);
    batch.set(transref, transaction);

    // create prymary auth / update related transfert
    // const approval=buildApproval(transfert,transaction,isprimary)
    // const sfRef = this.db.collection(APPROVAL_COLLECTION).doc(approval.code);
    // batch.set(sfRef, approval);

    // const transfref = this.db.collection(APPROVAL_COLLECTION).doc(transfert.id);
    // batch.update(transfref, {"statut":"IN APPROVAL"});
    transferts.unshift(transfert);//put the base transfert at the top of list
    for (let index = 0; index < transferts.length; index++) {
        const _transfert=transferts[index];
        const approval=buildApproval(_transfert,transaction,(isprimary && (index==0) ))
        const sfRef = this.db.collection(APPROVAL_COLLECTION).doc(approval.code);
        batch.set(sfRef, approval);
    
        const transfref = this.db.collection(TRANSFERT_COLLECTION).doc(_transfert.id);
        batch.update(transfref, {"status":"IN APPROVAL"});
    }

    // Commit the batch
    await batch.commit();
    return transferts;
};
const buildTransaction =  (matchingType:string)=>{
    
    return {
        "code":'TRANS-'+new Date().getTime(),
        "status":"IN APPROVAL",
        "startDate": new Date().toJSON(),
        "endDate":"test Bank",
        "comment":" newly created",
        matchingType,
};
}
const buildApproval =  (transfert:any,transaction:any,isprimary:boolean=false)=>{
    
    return {
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
};
}
const calculatefees =  (transfert:any)=>{
    return (+transfert.amount)*2/100;
}
const convertToOutZoneAmout =async  (transfert:any)=>{
    //call api to get the actual currency
    // multiply with the current amount
    return (+transfert.amount)
}

export {match,getOthersRequests,db,convertToOutZoneAmout}
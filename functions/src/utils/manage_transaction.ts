
import { Firestore } from "firebase-admin/firestore";
import { info} from "firebase-functions/logger";

import { getJpa } from "../jpa/transaction-jpa";
import { getApprovalJpa } from "../jpa/approval-jpa";
import { getJpaTransfert } from "../jpa/transfert-jpa";

import { Approval } from "../types/approval";
import { Transfert } from "../types/transfert";
import { Transaction } from "../types/transaction";

type FROM_TYPE= 'COMPLEXE' | 'SIMPLE'

export class TransactionManager{
    from?: FROM_TYPE='SIMPLE'
    transferts: Transfert[]=[];
    public db:Firestore ;
    public constructor(db: Firestore,ListOfverifiedRequest: Transfert[],from?: FROM_TYPE){
        this.db = db;
        this.transferts = ListOfverifiedRequest;
        this.from=from
        /**
         * if from==COMPLEXE then initiation need to be at the head of the list
         */
    }
    public async openTransaction() {
        const ApprovalRequests: Approval[]=[]
        info(`@@@@...................in openTransaction `);
        // Create  related objects in order to open the transaction
        // Get a new write batch
        let batch = this.db.batch();
        
        
        // create transaction
        const transaction= Transaction.initTransaction()
        batch = getJpa(this.db).put(transaction.code,transaction,batch) // const transref = this.db.collection(TRANSACTION_COLLECTION).doc(transaction.code); batch.set(transref, transaction);
    
        
        this.transferts.forEach((_transfert,index) =>{

            const approval=Approval.initApproval(_transfert,transaction,(index==0))
            batch = getApprovalJpa(this.db).put(approval.code,approval,batch) // const sfRef = this.db.collection(APPROVAL_COLLECTION).doc(approval.code); batch.set(sfRef, approval);
            
            const __transfert = Transfert.moveToApprovalState()
            batch = getJpaTransfert(this.db).put(_transfert.id,__transfert,batch) // const transfref = this.db.collection(TRANSFERT_COLLECTION).doc(_transfert.id);  batch.update(transfref, {"status":"IN APPROVAL"});
        
            ApprovalRequests.push(approval)
        })
        
    
        // Commit the batch
        await batch.commit();
        return ApprovalRequests;
    };
}

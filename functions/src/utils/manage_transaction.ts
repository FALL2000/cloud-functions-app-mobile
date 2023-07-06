
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
        info(`@@@@...................create transaction `);
        const transaction= Transaction.initTransaction()
        batch = await getJpa(this.db).put(transaction.code,transaction,batch) // const transref = this.db.collection(TRANSACTION_COLLECTION).doc(transaction.code); batch.set(transref, transaction);
    
        for (let index = 0; index < this.transferts.length; index++) {
            
            const _transfert = this.transferts[index];
            info(`@@@@.......START:Handle ${index}............${_transfert.id} `);
            const approval=Approval.initApproval(_transfert,transaction,(index==0))
            batch = await getApprovalJpa(this.db).put(approval.code,approval,batch) // const sfRef = this.db.collection(APPROVAL_COLLECTION).doc(approval.code); batch.set(sfRef, approval);
            
            const __transfert = Transfert.moveToApprovalState()
            batch = await getJpaTransfert(this.db).put(_transfert.id,__transfert,batch) // const transfref = this.db.collection(TRANSFERT_COLLECTION).doc(_transfert.id);  batch.update(transfref, {"status":"IN APPROVAL"});
            info(`@@@@...................view batch `);
            info(batch)
            ApprovalRequests.push(approval)
        }
        
        
        info(`@@@@...................Commit the batch `);
        // Commit the batch
        await batch.commit();
        return ApprovalRequests;
    };
}

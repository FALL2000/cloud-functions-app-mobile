import { Firestore } from "firebase-admin/firestore";
import { info} from "firebase-functions/logger";
import { Approval } from "../types/approval";

const APPROVAL_COLLECTION=process.env.APPROVAL_COLLECTION || 'approvals';


class Jpa {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }
    public async put(approval_id:string, approval: Approval, batch?:any) {
        info("Running Put Approval Id: "+approval_id+" with approval "+JSON.stringify(approval));
        const approvalref = this.db.collection(APPROVAL_COLLECTION).doc(approval_id);
        if (batch) {
            batch.set(approvalref, {...approval});
            return batch;
        }else 
            return await approvalref.set({...approval}, { merge: true });
    }
}
export function getApprovalJpa(db: Firestore): Jpa {
    return new Jpa(db);
};
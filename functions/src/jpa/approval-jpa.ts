import { Firestore } from "firebase-admin/firestore";
import { StatusApproval } from "../enum/approval_status";
import { StatusTranfert } from "../enum/status_enum";
//import * as functions from "firebase-functions";


const APPROVAL_COLLECTION=process.env.APPROVAL_COLLECTION || 'approvals';
const TRANSFERT_COLLECTION= process.env.TRANSFERT_COLLECTION || 'transferts';


class Jpa {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }
    

    public async findByTransfert(transfertId:string) {
        let dataTab:any=[];
        const snapshot = await this.db.collection(APPROVAL_COLLECTION).where('transfert.id', '==', transfertId).orderBy('startDate', 'desc').get();
        if (snapshot.empty) {
            return null;
        } 
        snapshot.forEach(doc => {
            dataTab.push({...doc.data(), id: doc.id});
        });
        return dataTab[0];
    }

    public async updateStatus(transfertId:string, approvalId:string, status:string) {
        
        const approvalref = this.db.collection(APPROVAL_COLLECTION).doc(approvalId);
        if(status == StatusApproval.Terminate){
            return await approvalref.set({status:status}, { merge: true });
        }else{
            const batch = this.db.batch();
            const transref = this.db.collection(TRANSFERT_COLLECTION).doc(transfertId);
            batch.update(approvalref, {status: status});
            if(status == StatusApproval.Approved){
                batch.update(transref, {status: StatusTranfert.Approved});
            }
            if(status == StatusApproval.Rejected){
                batch.update(transref, {status: StatusTranfert.Open});
            }
            if(status == StatusApproval.Canceled){
                batch.update(transref, {status: StatusTranfert.Canceled});
            }
            return await batch.commit();
        }  
    }
}
export function getApprovalJpa(db: Firestore): Jpa {
    return new Jpa(db);
};
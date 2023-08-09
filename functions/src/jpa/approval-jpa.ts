import { Firestore } from "firebase-admin/firestore";
//import * as functions from "firebase-functions";


const APPROVAL_COLLECTION=process.env.APPROVAL_COLLECTION || 'approvals';


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

    public async updateStatus(approvalId:string, status:string) {
        const approvalref = this.db.collection(APPROVAL_COLLECTION).doc(approvalId);
        return await approvalref.set({status:status}, { merge: true });  
    }
}
export function getApprovalJpa(db: Firestore): Jpa {
    return new Jpa(db);
};
import { Firestore } from "firebase-admin/firestore";
import { Transaction } from "../types/transaction";
import { info} from "firebase-functions/logger";

const TRANSACTION_COLLECTION = process.env.TRANSACTION_COLLECTION || 'Transaction';



class Jpa {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }
    public async put(transac_id:string, transaction: Transaction, batch?:any) {
        info("Running Put transaction Id: "+transac_id+" with transaction "+JSON.stringify(transaction));
        const transref = this.db.collection(TRANSACTION_COLLECTION).doc(transac_id);
        if (batch) {
            batch.set(transref, {...transaction});
            return batch;
        }else 
            return await transref.set({...transaction}, { merge: true });
    }
}
export function getJpa(db: Firestore): Jpa {
    return new Jpa(db);
};
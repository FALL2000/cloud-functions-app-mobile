import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

import { Transaction } from "./models/Transaction";


const TRANSACTION_COLLECTION = process.env.TRANSACTION_COLLECTION || 'Transaction';



class Jpa {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    public async create(transac: Transaction) {
        return await this.db.collection(TRANSACTION_COLLECTION).add({...transac})
    }

    public async put(transac_id:string, transac: Transaction) {
        const transac_ref = this.db.collection(TRANSACTION_COLLECTION).doc(transac_id);
        return await transac_ref.set({...transac}, { merge: true });
    }

    public async getOne(transac_id:string){
        const _transac = await this.db.collection(TRANSACTION_COLLECTION).doc(transac_id).get();
        if (!_transac.exists) {
            console.log('No such document!');
            throw new functions.https.HttpsError('not-found', 'No such document!');
        }
        return {..._transac.data(), id: _transac.id};
    }

    public async getAll(){
        const transactions:any[] = [];
        const snapshot = await this.db.collection(TRANSACTION_COLLECTION).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            throw new functions.https.HttpsError('not-found', 'No matching documents.');
        }  
        snapshot.forEach(doc => {
            transactions.push({...doc.data(), id: doc.id})
        });
        return transactions;
    }

    public async delete(transac_id:string){
        if (! transac_id) {
            throw new functions.https.HttpsError('not-found', 'Missing country Id for deletion');
        }
        const _transac = await this.db.collection(TRANSACTION_COLLECTION).doc(transac_id).delete();
        return _transac;
    }
}
export function getJpa(db: Firestore): Jpa {
    return new Jpa(db);
};
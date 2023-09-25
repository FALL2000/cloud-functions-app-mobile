import { Firestore } from "firebase-admin/firestore";
import { Transfert } from "../types/transfert";
import {updateField,} from "../utils/global_functions";
import * as functions from "firebase-functions";
import { info} from "firebase-functions/logger";
import { StatusTranfert } from "../enum/status_enum";
const TRANSFERT_COLLECTION= process.env.TRANSFERT_COLLECTION || 'transferts';

export class Jpatransfert {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    public async create(transfert: Transfert) {
        transfert.createdDate = new Date();
        transfert.LastTimeInPending = new Date();
        return await this.db.collection(TRANSFERT_COLLECTION).add({...transfert});
    }

    public async put(transfertId:string , transfert: Transfert) {
        info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ put')
        info(` id = ${transfertId} --> transfert = ${transfert}`)
        info(transfert)
        let fieldUpdate = updateField(transfert);

        info(` updated = ${fieldUpdate} `)
        const tranfertRef = this.db.collection(TRANSFERT_COLLECTION).doc(transfertId);
        return await tranfertRef.set({...fieldUpdate}, { merge: true });
    }

    public async getOne(transfertId:string){
        const transfert = await this.db.collection(TRANSFERT_COLLECTION).doc(transfertId).get();
        if (!transfert.exists) {
            throw new functions.https.HttpsError('not-found', 'Transfert Not Found');
        }
        return transfert;
    }

    public async getAll(){
        const transferts:any[] = [];
        const snapshot = await this.db.collection(TRANSFERT_COLLECTION).get();
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'Transferts Not Found');
        }  
        snapshot.forEach(doc => {
            transferts.push({...doc.data(), id: doc.id})
        });
        return transferts;
    }

    public async delete(transfertId:string){
        if (!transfertId) {
            throw new functions.https.HttpsError('not-found', 'Missing Transfert Id for deletion');
        }
        const transfert = await this.db.collection(TRANSFERT_COLLECTION).doc(transfertId).delete();
        return transfert;
    }

    public async findByUser(usersId:string){
        const transferts:any[] = [];
        const snapshot = await this.db.collection(TRANSFERT_COLLECTION).where('ownerId', '==', usersId).where('status', '!=', StatusTranfert.Canceled).get();
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'Transferts Not Found');
        }  
        snapshot.forEach((doc:any) => {
            transferts.push({...doc.data(), id: doc.id})
        });
        return transferts;
    }
}

export function getJpaTransfert(db: Firestore): Jpatransfert {
    return new Jpatransfert(db);
};

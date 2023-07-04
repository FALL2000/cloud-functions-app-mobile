import { Firestore } from "firebase-admin/firestore";
import { Transfert } from "../types/transfert";
import {updateField} from "../utils/global_functions";
import * as functions from "firebase-functions";
import { info} from "firebase-functions/logger";
import { StatusJob } from "../enum/job_status";
import { StatusTranfert } from "../enum/request_status";
const TRANSFERT_COLLECTION= process.env.TRANSFERT_COLLECTION || 'transferts';

export class Jpatransfert {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    
    
    public async put(transfertId:string , transfert: Transfert) {
        let fieldUpdate = updateField(transfert);
        const tranfertRef = this.db.collection(TRANSFERT_COLLECTION).doc(transfertId);
        return await tranfertRef.set({...fieldUpdate}, { merge: true });
    }

    public async getOne(transfertId:string){
        const transfert = await this.db.collection(TRANSFERT_COLLECTION).doc(transfertId).get();
        if (!transfert.exists) {
            throw new functions.https.HttpsError('not-found', 'Transfert Not Found');
        }
        const req= {...transfert.data(), id: transfert.id};
        if (req.status!= StatusTranfert.Open) {throw new functions.https.HttpsError('not-found', 'Transfert is not');}
    }
    /*
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
        const snapshot = await this.db.collection(TRANSFERT_COLLECTION).where('ownerId', '==', usersId).get();
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'Transferts Not Found');
        }  
        snapshot.forEach((doc:any) => {
            transferts.push({...doc.data(), id: doc.id})
        });
        return transferts;
    }
<<<<<<< HEAD

    public async findByAmountAndStatus(transfert: Transfert){
        const transferts:any[] = [];
        const snapshot = await this.db.collection(TRANSFERT_COLLECTION).where('amount', '<=', transfert.amount).where('status', '==', 'OPEN').where('inZone.country.code', '==', transfert.inZone).where('outZone.country.code', '==', transfert.outZone).orderBy('amount','desc').get();
        if (snapshot.empty) {
            return null;
        }else{
            snapshot.forEach((doc:any) => {
                transferts.push({...doc.data(), id: doc.id})
            });
            return transferts;
        }   
=======
    */

    public async getPotentailRequests( _amount: number,in_zone: string,out_zone: string){
        info(`@@@@...................in getPotentailRequests amount  ${_amount} out_zone ${out_zone}`);

        const requestsRef = this.db.collection(TRANSFERT_COLLECTION);
        const queryRef = requestsRef.where('inZoneId', '==', out_zone)
                                        .where('outZoneId', '==', in_zone)
                                        .where('status', '==', StatusTranfert.Open)
                                        .where('amount','<=', _amount)
                                        .orderBy('amount', 'desc');
        const snapshot = await queryRef.get();

        const requests:any[]=[]
        if (snapshot.empty) {
            info('getPotentailRequests :: No matching documents.');
        }  
        snapshot.forEach((doc:any) => {
            info(doc.id, '=>', doc.data());
            requests.push({...doc.data(), id: doc.id})
        });
        return requests;
    }
    public async getMatchingTriggerListRequests( _amount: number,in_zone: string,out_zone: string){
        info(`@@@@...................in getMatchingTriggerListRequests amount  ${_amount} out_zone ${out_zone}`);
        const requestsRef = this.db.collection(TRANSFERT_COLLECTION);
        const queryRef = requestsRef.where('inZoneId', '==', out_zone)
                                        .where('outZoneId', '==', in_zone)
                                        .where('status', '==', StatusTranfert.Open)
                                        .where('amount','>', _amount)
                                        .orderBy('amount', 'desc');
        const snapshot = await queryRef.get();
        const requests:any[]=[]
        if (snapshot.empty) {
            info('getMatchingTriggerListRequests :: No matching documents.');
        }  
        snapshot.forEach((doc:any) => {
            info(doc.id, '=>', doc.data());
            requests.push({...doc.data(), id: doc.id})
        });
        return requests;
>>>>>>> 184eb15add054de5dc110a02ad04a7dfa5e88160
    }
}

export function getJpaTransfert(db: Firestore): Jpatransfert {
    return new Jpatransfert(db);
};

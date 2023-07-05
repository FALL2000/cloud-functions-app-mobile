import { Firestore, FieldPath } from "firebase-admin/firestore";
import { Transfert } from "../types/transfert";
import * as functions from "firebase-functions";
import { info} from "firebase-functions/logger";
import { StatusTranfert } from "../enum/request_status";
const TRANSFERT_COLLECTION= process.env.TRANSFERT_COLLECTION || 'transferts';

export class Jpatransfert {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    
    
    public async put(transfertId:string , transfert: Transfert, batch?:any) {
        const transref = this.db.collection(TRANSFERT_COLLECTION).doc(transfertId);
        if (batch) {
            batch.update(transref, {...transfert});
            return batch;
        }else 
            return await transref.set({...transfert}, { merge: true });
    }

    public async getOne(transfertId:string):Promise<Transfert>{
        const transfert = await this.db.collection(TRANSFERT_COLLECTION).doc(transfertId).get();
        if (!transfert.exists) {
            throw new functions.https.HttpsError('not-found', 'Transfert Not Found');
        }
        const req:any= {...transfert.data(), id: transfert.id};
        if (req.status!= StatusTranfert.Open) {throw new functions.https.HttpsError('not-found', 'Transfert is not');}

        return Transfert.buildRequest(req)
    }
    
    public async getMany(transfertIds:string[], _amount: number,request:Transfert):Promise<Transfert[]>{
        const transferts:Transfert[] = [];
        const snapshot = await this.db.collection(TRANSFERT_COLLECTION).where(FieldPath.documentId(), 'in', transfertIds)
                                           .where('inZone.country.code', '==', request.outZoneId)
                                           .where('outZone.country.code', '==', request.inZoneId)
                                           .where('status', '==', StatusTranfert.Open)
                                           .where('amount','<=', _amount)
                                           .orderBy('amount', 'desc').get();
        
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'Transfert Not Found');
        }
        snapshot.forEach((doc:any) => {
            transferts.push(Transfert.buildRequest({...doc.data(), id: doc.id}))
        });
        return transferts;
        
    }
    

    public async getPotentailRequests( _amount: number,in_zone: string,out_zone: string){
        info(`@@@@...................in getPotentailRequests amount  ${_amount} out_zone ${out_zone}`);

        const requestsRef = this.db.collection(TRANSFERT_COLLECTION);
        const queryRef = requestsRef.where('inZone.country.code', '==', out_zone)
                                        .where('outZone.country.code', '==', in_zone)
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
            requests.push(Transfert.buildRequest({...doc.data(), id: doc.id}))
        });
        return requests;
    }
    public async getMatchingTriggerListRequests( _amount: number,in_zone: string,out_zone: string){
        info(`@@@@...................in getMatchingTriggerListRequests amount  ${_amount} out_zone ${out_zone}`);
        const requestsRef = this.db.collection(TRANSFERT_COLLECTION);
        const queryRef = requestsRef.where('inZone.country.code', '==', out_zone)
                                        .where('outZone.country.code', '==', in_zone)
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
            requests.push(Transfert.buildRequest({...doc.data(), id: doc.id}))
        });
        return requests;
    }
}

export function getJpaTransfert(db: Firestore): Jpatransfert {
    return new Jpatransfert(db);
};

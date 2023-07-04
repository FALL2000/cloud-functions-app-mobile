import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { AsyncJob } from "../types/job";
const ASYNCJOB_COLLECTION= process.env.ASYNCJOB_COLLECTION || 'AsyncJob';

export class JpaJob {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    public async getFirstJob(_univers:any){
        let _job :any =null;
        const jobRef=this.db.collection(ASYNCJOB_COLLECTION).where('univers', '==', _univers).orderBy("createdDate","asc").limit(1);
        const snapshot = await jobRef.get();;
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'no async job founded');
        } 
        snapshot.forEach((doc:any) => {
            _job={...doc.data(), id: doc.id}
        });
         return _job;
    }
    public async put(jobId:string , _job: any) {
        const jobRef = this.db.collection(ASYNCJOB_COLLECTION).doc(jobId);
        return await jobRef.set({..._job}, { merge: true });
    }
    public async create(  _job: any) {
        return await this.db.collection(ASYNCJOB_COLLECTION).add({..._job});

    }

    public async  createAsyncJobTriggerSimple(MatchingTriggerList:any[], _parentJob:AsyncJob){
        const __asyncJobTrigger:AsyncJob= AsyncJob.buildSimpleQueuedJob();
        __asyncJobTrigger.recordIds= MatchingTriggerList.map(x=>x.id);
        __asyncJobTrigger.univers= _parentJob.univers
        return await this.create(__asyncJobTrigger.toSave())
    }
    public async  createNextAsyncJobTriggerSimple (recordIds:any[], _parentJob:AsyncJob){
        const __asyncJobTrigger:AsyncJob= AsyncJob.buildSimpleReadyJob();
        __asyncJobTrigger.recordIds= recordIds;
        __asyncJobTrigger.univers= _parentJob.univers
        return await this.create(__asyncJobTrigger.toSave())
    }
}

export function getJpaJob(db: Firestore): JpaJob {
    return new JpaJob(db);
};
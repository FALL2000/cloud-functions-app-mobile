
import { Firestore } from "firebase-admin/firestore";
import { mutex } from "../types/mutex";
const MUTEX_COLLECTION= process.env.MUTEX_COLLECTION || 'Mutex';

export class JpaMutex {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    public async getOne(mutexId:any) : Promise<mutex|null>{
        const mutex =  await this.db.collection(MUTEX_COLLECTION).doc(mutexId).get();
        if (!mutex.exists) {
              return null
        }else{
            return new mutex(mutexId,mutex.get('isRunning'))
        }
    }
    public async put(mutexId:string , _mutex: any) {
        const mutexRef = this.db.collection(MUTEX_COLLECTION).doc(mutexId);
        return await mutexRef.set({..._mutex}, { merge: true });
    }
}

export function getJpaMutex(db: Firestore): JpaMutex {
    return new JpaMutex(db);
};
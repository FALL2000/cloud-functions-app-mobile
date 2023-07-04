import { Firestore } from "firebase-admin/firestore";
import { mutex } from "../types/mutex";
const MUTEX_COLLECTION= process.env.MUTEX_COLLECTION || 'Mutex';

export class JpaMutex {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    public async getOne(mutexId:any) : Promise<mutex|null>{
        const _mutex =  await this.db.collection(MUTEX_COLLECTION).doc(mutexId).get();
        if (!_mutex.exists) {
              return null
        }else{
            return new mutex(<string> mutexId, <boolean> _mutex.get('isRunning'))
        }
    }
}

export function getJpaMutex(db: Firestore): JpaMutex {
    return new JpaMutex(db);
};
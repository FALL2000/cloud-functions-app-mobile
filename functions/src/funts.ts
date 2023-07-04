import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
//import { info} from "firebase-functions/logger";
import { Transfert } from "./types/transfert";
import { getJpaTransfert } from "./jpa/transfert-jpa";
import { getJpaMutex } from "./jpa/mutex-jpa";
import { Response } from "./types/response";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
// const transfertJPA= getJpaTransfert(db);
const mutexJPA= getJpaMutex(db);

let _asyncJob:AsyncJob =  new AsyncJob()

const  isRunning =  (univers:string):boolean=>{
    // const _mutex // query from the mutex table the element with id == univers
    // if(_mutex.empty()) return false
    // else return _mutex.isRunning
    return false
 }
 const  updateMutex = async (isRunning:boolean)=>{
    // const _mutex={ id: univers,isRunning }
    // upsert _mutex
}

/*const createTransfert = async (transfert: Transfert) => {
    let transInsert = await transfertJPA.create(transfert);
    let res = new Response();
    res.body = transInsert.id;
    res.message = "Transfert Created";
    return res;
}

const exec = async (mutex: any) => {
    const _job=await selectMostLastAsyncJob(mutex);
        if(_job) await updateAsyncJob(_job.id)
}

const updateAsyncJob = async (jobId:string) => {
    const _job={
        status: StatusJob.Ready
    }
    await jobJPA.put(jobId,_job);
}

const selectMostLastAsyncJob = async (mutex: any) => {
    return await jobJPA.getFirstJob(mutex.id);
}
*/
export {createTransfert, getAllTransfert, getOneTransfert, deleteTransfert, updateTransfert};




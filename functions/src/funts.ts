import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { getJpaJob } from "./jpa/job-jpa";
import { getJpaMutex } from "./jpa/mutex-jpa";
import { StatusJob } from "./enum/job_status";
import { AsyncJob } from "./types/job";
import { typeJob } from "./enum/job_type";
import { request_match } from "./utils/request_match";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
const jobJPA= getJpaJob(db);

let _asyncJob:AsyncJob =  new AsyncJob()


const exec = async (job: any) => {
    _asyncJob=AsyncJob.buildJob({...job})
    await updateMutex(true);
    await perfomJob();
    if(isComplexeJob()) await updateMutex(false);
}
const  perfomJob = async ()=>{
    if(isComplexeJob()) {
       await runComplexJob();
    }else{
        await runSimpleJob();
    }
 
}
const updateAsyncJob = async (jobId:string) => {
    const _job={
        status: StatusJob.Ready
    }
    await jobJPA.put(jobId,_job);
}

const  isComplexeJob =  ()=>{
    return _asyncJob.type==typeJob.Complexe;
}
const  updateMutex = async (isRunning:boolean)=>{
    const mutexJPA= getJpaMutex(db);
    const _mutex={ isRunning }
    await mutexJPA.put(_asyncJob.univers,{..._mutex})
}   
const  runComplexJob = async ()=>{
    const _primaryReqId= _asyncJob.id || _asyncJob.recordIds[0]
    const _request_match= new request_match(db, _primaryReqId)
    await _request_match.doComplexeMatch()
}
const  runSimpleJob = async ()=>{

    if(_asyncJob.recordIds?.length <= 0) return null;

    const recordIds=[..._asyncJob.recordIds]
    const _reqid= recordIds.shift() ||'';
    const _request_match= new request_match(db, _reqid)
    const founded = await _request_match.doSimpleMatch()

    if(recordIds.length == 0)//is last job of the sequence 
        return await updateMutex(false)
    else
        return await jobJPA.createNextAsyncJobTriggerSimple(recordIds,_asyncJob)
    

}
export {exec};




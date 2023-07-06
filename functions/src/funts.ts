import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { getJpaJob } from "./jpa/job-jpa";
import { getJpaMutex } from "./jpa/mutex-jpa";
// import { StatusJob } from "./enum/job_status";
import { AsyncJob } from "./types/job";
import { typeJob } from "./enum/job_type";
import { request_match } from "./utils/request_match";

import { info,error} from "firebase-functions/logger";
import { StatusJob } from "./enum/job_status";
const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
const jobJPA= getJpaJob(db);

let _asyncJob:AsyncJob =  new AsyncJob()


const exec = async (job: any) => {
    info("Executing")
    try {
        _asyncJob=AsyncJob.buildJob({...job})
        await updateMutex(true);
        await perfomJob();
        if(isComplexeJob()) await updateMutex(false);
    } catch (error:any) {
        // close JOB with error status
        const __job = {error: true, errMessage: error.message}
        await closeJob(job.id,__job)
        await updateMutex(false);
    }
    
}
const  perfomJob = async ()=>{
    info("Running perfom")
    if(isComplexeJob()) {
       await runComplexJob();
    }else{
        await runSimpleJob();
    }
    const __job = {error: false,}
    await closeJob(_asyncJob.id,__job)
}
const closeJob = async (jobId:string,_job:any) => {
    const __job={
        status: StatusJob.Closed,
        ..._job
    }
    await jobJPA.put(jobId,__job);
}

const  isComplexeJob =  ()=>{
    info("Running isComplexeJob _type: " + _asyncJob.type)
    return _asyncJob.type==typeJob.Complexe;
}
const  updateMutex = async (isRunning:boolean)=>{ 
    info('updating mutex : isRunning : '+isRunning)
    const _mutex={ isRunning }
    await getJpaMutex(db).put(_asyncJob.univers,{..._mutex})
}   
const  runComplexJob = async ()=>{
    info('Running complex job')
    const _primaryReqId= _asyncJob.id || _asyncJob.recordIds[0]
    const _request_match= new request_match(db, _primaryReqId,_asyncJob)
    await _request_match.doComplexeMatch()
}
const  runSimpleJob = async ()=>{
    info('Running simple job')
    if(_asyncJob.recordIds?.length <= 0) return null;

    const recordIds=[..._asyncJob.recordIds]
    const _reqid= recordIds.shift() ||'';
    try {
        const _request_match= new request_match(db, _reqid)
        await _request_match.doSimpleMatch()  
    } catch (_error:any) {
        error(_error)
        //create a log 
        const __job = {error: true, errMessage: _error.message}
        await closeJob(_asyncJob.id,__job)
    }
    

    if(recordIds.length == 0)//is last job of the sequence 
       { info('is last job of the sequence ')
        return await updateMutex(false)}
    else
        return await jobJPA.createNextAsyncJobTriggerSimple(recordIds,_asyncJob)
    

}
export {exec};




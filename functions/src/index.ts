import * as functions from "firebase-functions";
import { info} from "firebase-functions/logger";
import { exec } from "./funts";
import { StatusJob } from "./enum/job_status";
const ASYNCJOB_COLLECTION= process.env.ASYNCJOB_COLLECTION || 'AsyncJob';
const STATUS_FIELD='status';
const STATUS_READY=process.env.STATUS_READY || StatusJob.Ready;
let _asyncJob:any=null
let __asyncJob:any=null
exports.job_trigger = functions.firestore
    .document(ASYNCJOB_COLLECTION+'/{jobId}')
    .onWrite(async (change, context) => {

      const jobId=context.params.jobId;
      info(`Launch job_trigger: jobId ${jobId} }`)

      _asyncJob = change.after.exists ? change.after.data() : {};
      __asyncJob = change.before.exists ? change.before.data() : {};;
            
      info('....new document');info(_asyncJob)
      info('....old document');info(__asyncJob)


      const isNew= ! change.before.exists;
      const isDelete= ! change.after.exists;
      const isUpdate=  ! (isNew || isDelete);

      info(` IsNEW ${isNew} isDelete ${isDelete} isUpdate ${isUpdate}`)
    
    const status= _asyncJob[STATUS_FIELD]
    if ( (isNew || (isUpdate && statusChanged()) ) && status==STATUS_READY) {
        await exec({..._asyncJob,id:jobId});
    }
});
const statusChanged = ()=> { return isChange(STATUS_FIELD, _asyncJob, __asyncJob)}
const isChange = (field: string, oldObj: any, newObj: any):boolean => {
    if(! field || ! oldObj || ! newObj) return false;
    return oldObj[field] !== newObj[field]; 
}

import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { getJpaJob } from "./jpa/job-jpa";
import { StatusJob } from "./enum/job_status";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
const jobJPA= getJpaJob(db);



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
export {exec};




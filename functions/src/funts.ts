import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { getJpaMutex } from "./jpa/mutex-jpa";
import { getJpaJob } from "./jpa/job-jpa";
import { util } from "./utils/utils";
import { request_match } from "./utils/request_match";
import { AsyncJob } from "./types/job";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
// const transfertJPA= getJpaTransfert(db);
const mutexJPA= getJpaMutex(db);
const jobJPA= getJpaJob(db);

let asyncJob:AsyncJob =  new AsyncJob()

const triggerLogic = async (transfertId:string) =>{
    let univers = util.buildUnivers();
    let recordIds = [transfertId];
    if(await isRunning(univers)){
        await jobJPA.createAsyncJobTriggerComplexe(recordIds, univers);
    }else{
        await updateMutex(true, univers);
        const _request_match = new request_match(db, transfertId, asyncJob);
        await _request_match.doComplexeMatch();
    }
}

const  isRunning =  async (univers:string):Promise<boolean> => {
    let mutex = await mutexJPA.getOne(univers);
    if(mutex == null){
        return false
    }else{
        return mutex.isRunning;
    }
}

const  updateMutex = async (isRunning:boolean, univers:string)=>{
    const mutex={ isRunning }
    await getJpaMutex(db).put(univers,{...mutex})
}

export {triggerLogic};




import { StatusJob } from "../enum/job_status";
import { typeJob } from "../enum/job_type";
import { info} from "firebase-functions/logger";

export class AsyncJob{
    id: string='';
    univers: string='';
    status?: StatusJob;
    type?: typeJob;
    recordIds: string[] = [];
    createdDate: Date = new Date();
    lastUpDate: Date = new Date();
    constructor(){ 
    }
    public toSave():any{
        const {id,...rest}=this;
        return rest;
    }

    public static buildJob(job:any){
        info("Building job: " + JSON.stringify(job)); 
        const _job=Object.assign(new AsyncJob(), job)
       /* _job.id=job.id
        const tab=job['recordIds']
        info([...tab])
        _job.recordIds=Objet.<string[]>tab
        (job.createdDate)?_job.createdDate=job.createdDate:''
        _job.univers=job.univers
        _job.status=<StatusJob>job.status
        _job.type=<typeJob>job.type*/
        info(_job)
        return _job
    }
    public static buildSimpleQueuedJob(){
        info("Running buildSimpleQueuedJob")
        const _job=new AsyncJob()
        _job.status= StatusJob.Queued;
        _job.type= typeJob.Simple;//'SIMPLE',
        // _job.createdDate= new Date() ;
        // _job.lastUpDate= new Date() ;
        info(_job)
        return _job
    }
    public static buildSimpleReadyJob(){
        info("Running buildSimpleReadyJob")
        const _job=new AsyncJob()
        _job.status= StatusJob.Ready;
        _job.type= typeJob.Simple;//'SIMPLE',
        // _job.createdDate= new Date() ;
        // _job.lastUpDate= new Date() ;
        info(_job)
        return _job
    }
    public static buildComplexeQueuedJob(){
        info("Running buildSimpleQueuedJob")
        const _job=new AsyncJob()
        _job.status= StatusJob.Queued;
        _job.type= typeJob.Complexe;//'COMPLEXE',
        // _job.createdDate= new Date() ;
        // _job.lastUpDate= new Date() ;
        info(_job)
        return _job
    }
}
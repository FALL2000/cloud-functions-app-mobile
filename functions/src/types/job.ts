import { StatusJob } from "../enum/job_status";
import { typeJob } from "../enum/job_type";

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
        const _job=new AsyncJob()
        _job.id=job.id
        _job.univers=job.univers
        _job.status=<StatusJob>job.status
        _job.type=<typeJob>job.type
        return _job
    }
    public static buildSimpleQueuedJob(){
        const _job=new AsyncJob()
        _job.status= StatusJob.Queued;
        _job.type= typeJob.Simple;//'SIMPLE',
        // _job.createdDate= new Date() ;
        // _job.lastUpDate= new Date() ;
        return _job
    }
    public static buildSimpleReadyJob(){
        const _job=new AsyncJob()
        _job.status= StatusJob.Ready;
        _job.type= typeJob.Simple;//'SIMPLE',
        // _job.createdDate= new Date() ;
        // _job.lastUpDate= new Date() ;
        return _job
    }
}
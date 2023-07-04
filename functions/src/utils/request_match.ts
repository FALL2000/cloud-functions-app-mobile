import { Firestore } from "firebase-admin/firestore";
import { getJpaTransfert } from "../jpa/transfert-jpa";
import { Transfert } from "../types/transfert";
import { getJpaJob } from "../jpa/job-jpa";
import { AsyncJob } from "../types/job";

export class request_match{
    requestId: string='';
    _amount: number=0;
    _asyncJob?: AsyncJob;
    _req: Transfert=new Transfert();
    public db:Firestore
    ;
    public constructor(db: Firestore,requestId: string,parentJob?: AsyncJob){
        this.db = db;
        this.requestId = requestId;
        this._asyncJob=parentJob
    }
    public doSimpleMatch = async ():Promise<boolean>=>{
        const req=getJpaTransfert(this.db).getOne(this.requestId );// get the request from database where id==req.id and status=='OPEN'
        this._req=Transfert.buildRequest(req)
        if(this._req.checkfeasibility()){
                // filed _amount
                this._amount = await this.convertAmount()
                //call find_match(req = {id, amount, inzoneid, outzoneid}, _amount)
                return true // todo true if founded
        }else{ /**end of job */}
        
        return true
    }
    public doComplexeMatch = async ()=>{
        // const primaryReqId=this.requestId
        if(await this.doSimpleMatch()) return;
        else{
            const in_zone= this._req.outZoneId
            const out_zone= this._req.inZoneId

            const MatchingTriggerList= await getJpaTransfert(this.db).getMatchingTriggerListRequests(this._amount,in_zone,out_zone);// query all open request form the outzone and  the amount 
            
            if(this._asyncJob && MatchingTriggerList?.length>0) await getJpaJob(this.db).createNextAsyncJobTriggerSimple(MatchingTriggerList,this._asyncJob)
        }
    }
    public convertAmount = async ():Promise<number>=>{
        //this._req

        return 10;
    }
}
import { Firestore } from "firebase-admin/firestore";
export class request_match{
    requestId: string='';
    public db:Firestore
    ;
    public constructor(db: Firestore,requestId: string){
        this.db = db;
        this.requestId = requestId;
    }
    public doSimpleMatch = async ():Promise<boolean>=>{
        const reqId=this.requestId
        // const req// get the request from database where id==req.id and status=='OPEN'
        //if req is not founded end of job 
        // if(checkfeasibility(req)){
        //     // filed _amount
        //     //call find_match(req = {id, amount, inzoneid, outzoneid}, _amount)
        //     return true if founded
        // }else{ /**end of job */}
        return true
    }
    public doComplexeMatch = async ()=>{
        const primaryReqId=this.requestId
        // if(await doSimpleMatch(_primaryReqId)) return;
        // else{
        //     const MatchingTriggerList;// query all open request form the outzone and  the amount 
        //     await createAsyncJobTriggerSimple(MatchingTriggerList)
        // }
    }
    
}
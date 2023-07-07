import { StatusTranfert } from "../enum/request_status";
import { util } from "../utils/utils";
import { info} from "firebase-functions/logger";

export class Transfert {
    id:string='';
    amount:number=0;
    inZoneId:string='';
    outZoneId:string='';
    outZoneCurrency:string='';
    inZoneCurrency:string='';
    ownerId:string='';
    status:string='';
   
    /*constructor(id:string, amount:number, inZone:string, outZone:string, currency:string){
        this.id = id;
        this.amount=amount;
        this.inZone=inZone;
        this.outZone=outZone;
        this.currency=currency;
    }*/

    public checkfeasibility():boolean{
        info("checkfeasibility:::: amount: " + this.amount+" and inZone: " + this.inZoneId+" and outZone: "+this.outZoneId+" and currency: " + this.currency)
        if(this.amount && this.amount > 0 && this.inZoneId != this.outZoneId){
            return true;
        }else{
            return false;
        }
    }
    public static buildRequest(req:any): Transfert{
        info("Building request: " + JSON.stringify(req))
        const _req= new Transfert()
        // const _req=Object.assign(new Transfert(), req)
       
        _req.amount = req.amount;
        _req.id = req.id;
        _req.inZoneId = <string> util.getValue(req,'inZone.country.code');//req.inZone.country.code;
        _req.outZoneId =<string> util.getValue(req,'outZone.country.code');// req.outZone.country.code;
        _req.outZoneCurrency =<string> util.getValue(req,'outZone.country.currency');// req.outZone.country.currency;
        _req.inZoneCurrency =<string> util.getValue(req,'inZone.country.currency');// req.inZone.country.currency;
        _req.ownerId = req.ownerId;
        _req.status = req.status;

        const {lastname,firstname} = req.owner
        _req.owner={lastname,firstname}
        info(_req)
        return _req;
    }
    public static moveToApprovalState():any{
        info("MoveToApprovalState")
        return {
            status : StatusTranfert.InApproval
        }
    }
    public owner:any={};

    
}
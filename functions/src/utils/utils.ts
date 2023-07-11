import { Transfert } from "../types/transfert";
import { info} from "firebase-functions/logger";


const util:any={};
util.checkfeasibility = (transfert:Transfert):boolean=>{
    if(transfert.amount && transfert.amount > 0 && transfert.inZoneId != transfert.outZoneId){
        return true;
    }else{
        return false;
    }
}
util.buildUnivers  = (inZoneId:string, outZoneId:string):string=>{
    let univers = (inZoneId < outZoneId) ?  inZoneId+'-'+outZoneId : outZoneId+''+inZoneId;
    info("buildUnivers univers: " + univers)
    return univers;
}
function getValue(obj:any,field:string):any{
    
    if (!field || !obj) return ''
    //info("getValue called with field: " + field+ " and obj: " + JSON.stringify(obj))
    if(!!field && field.includes('.')) {
      obj=obj[field.split('.')[0]];
      field=field.substring( field.indexOf('.')+1)//field.split('.')[1];
      return getValue(obj, field)
    }
    else {
        const value=obj[field];
        //info("getValue value: " + value)
        return value
    }
}
util.getValue=getValue
export {util}



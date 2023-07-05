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
util.buildUnivers  = (transfert:Transfert):string=>{
    let univers = (transfert.inZoneId < transfert.outZoneId) ?  transfert.inZoneId+''+transfert.outZoneId : transfert.outZoneId+''+transfert.inZoneId
    return univers;
}
function getValue(obj:any,field:string):any{
    
    if (!field || !obj) return ''
    info("getValue called with field: " + field+ " and obj: " + JSON.stringify(obj))
    if(!!field && field.includes('.')) {
      obj=obj[field.split('.')[0]];
      field=field.split('.')[1];
      return getValue(obj, field)
    }
    else {
        const value=obj[field];
        info("getValue value: " + value)
        return value
    }
}
util.getValue=getValue
export {util}



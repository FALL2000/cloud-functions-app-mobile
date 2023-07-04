import { Transfert } from "../types/transfert";
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
export {util}



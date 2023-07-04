import { Transfert } from "../types/transfert";
const util:any={};
util.checkfeasibility = (transfert:Transfert):boolean=>{
    if(transfert.amount && transfert.amount > 0 && transfert.inZone != transfert.outZone){
        return true;
    }else{
        return false;
    }
}
util.buildUnivers  = (transfert:Transfert):string=>{
    let univers = (transfert.inZone < transfert.outZone) ?  transfert.inZone+''+transfert.outZone : transfert.outZone+''+transfert.inZone
    return univers;
}
export {util}



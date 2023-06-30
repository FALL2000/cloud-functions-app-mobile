import * as functions from "firebase-functions";
import { info} from "firebase-functions/logger";
import { exec } from "./funts";
const MUTEX_COLLECTION= process.env.MUTEX_COLLECTION || 'Mutex';
const RUNNING_FIELD='isRunning';
let _mutex:any=null
let __mutex:any=null
exports.mutex_trigger = functions.firestore
    .document(MUTEX_COLLECTION+'/{mutexId}')
    .onWrite(async (change, context) => {

      const _univers=context.params.mutexId;
      info(`Launch mutex_trigger: _univers ${_univers} }`)

      _mutex = change.after.exists ? change.after.data() : null;
      __mutex = change.before.exists ? change.before.data() : null;;
            
      info('....new document');info(_mutex)
      info('....old document');info(__mutex)


      const isNew= ! change.before.exists;
      const isDelete= ! change.after.exists;
      const isUpdate=  ! (isNew || isDelete);

      info(` IsNEW ${isNew} isDelete ${isDelete} isUpdate ${isUpdate}`)

      const isRunning= _mutex?.isRunning
      if ( isUpdate && runningChanged() && isRunning==false) {
          await exec({..._mutex,id:_univers});
      }
});
const runningChanged = ()=> { return isChange(RUNNING_FIELD, _mutex, __mutex)}
const isChange = (field: string, oldObj: any, newObj: any):boolean => {
    if(! field || ! oldObj || ! newObj) return false;
    return oldObj[field] !== newObj[field]; 
}

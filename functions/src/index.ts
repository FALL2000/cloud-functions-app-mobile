import * as functions from "firebase-functions";
import { info} from "firebase-functions/logger";
import { triggerLogic } from "./funts";
const TRANSFERT_COLLECTION= process.env.TRANSFERT_COLLECTION || 'transferts';

exports.request_trigger = functions.firestore
    .document(TRANSFERT_COLLECTION+'/{transfertId}')
    .onWrite(async (change, context) => {
      const transfertId=context.params.transfertId;
      info(`Launch request_trigger: transfertId ${transfertId} onWrite: ${JSON.stringify(change)}`)
      const isNew= ! change.before.exists;
      const isDelete= ! change.after.exists;
      const isUpdate=  ! (isNew || isDelete);
      const amountChange = change.before.get('amount') != change.after.get('amount');
      const statusChange = change.before.get('status') != change.after.get('status');
      const inZoneChange = change.before.get('inZone.country.code') != change.after.get('inZone.country.code');
      const outZoneChange = change.before.get('outZone.country.code') != change.after.get('outZone.country.code');
      const validField =  amountChange || statusChange || inZoneChange || outZoneChange;

      if(isNew || (isUpdate && validField)){
         await triggerLogic(transfertId);
      }
});

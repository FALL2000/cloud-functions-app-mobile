import * as functions from "firebase-functions";
import { info} from "firebase-functions/logger";
const TRANSFERT_COLLECTION= process.env.TRANSFERT_COLLECTION || 'transferts';

exports.request_trigger = functions.firestore
    .document(TRANSFERT_COLLECTION+'/{transfertId}')
    .onWrite((change, context) => {
      const transfertId=context.params.transfertId;
      info(`Launch request_trigger: transfertId ${transfertId} onWrite: ${JSON.stringify(change)}`)
      
      // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
      info('....new document')
      const document = change.after.exists ? change.after.data() : null;
      info(document)
      // Get an object with the previous document value (for update or delete)
      info('....old document')
      const _document = change.before.data();
      info(_document)


      const isNew= ! change.before.exists;
      const isDelete= ! change.after.exists;
      const isUpdate=  ! (isNew || isDelete);

      info(` IsNEW ${isNew} isDelete ${isDelete} isUpdate ${isUpdate}`)
      // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
      // context.params.userId == "marie";
      // context.params.messageCollectionId == "incoming_messages";
      // context.params.messageId == "134";
      // ... and ...
      // change.after.data() == {body: "Hello"}
});

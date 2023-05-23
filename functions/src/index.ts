import * as functions from "firebase-functions";
//import * as admin from "firebase-admin";
//import {getFirestore} from "firebase-admin/firestore";
import {toTransfert} from "./utils/global_functions";
//import { City } from "./types/city";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

exports.nlManageRequest = functions.https.onCall(async (data, context) => {
   return toTransfert(data.body, context.auth?.uid);
});

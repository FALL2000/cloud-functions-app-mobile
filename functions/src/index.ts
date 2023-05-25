import * as functions from "firebase-functions";
//import * as admin from "firebase-admin";
//import {getFirestore} from "firebase-admin/firestore";
import {toTransfert} from "./utils/global_functions";
import {createTransfert, getAllTransfert, getOneTransfert, deleteTransfert } from "./funts";
import { Response } from "./types/response";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

//const SAVE_ROLE = ["CLIENT"];
//const GETALL_ROLE = ["CLIENT","ADMIN","GESTIONNAIRE","AGENT"];

type availableAction = "SAVE" | "DELETE" | 'GET-INFO' | 'GET-ALL' | 'UPDATE';

exports.nlManageRequest = functions.https.onCall(async (data, context) => {
    let transfert:any;
    try {
        if(data.transfert){
            transfert = await toTransfert(data.transfert, context);
        }
        const action:availableAction = data.action;
        switch (action) {
            case 'SAVE':
                return createTransfert(transfert);
            case 'GET-ALL':
                return getAllTransfert(context);
            case 'GET-INFO':
                return getOneTransfert(data.transfertId);
            case 'DELETE':
                return deleteTransfert(data.transfertId);
            default:
                throw new functions.https.HttpsError('failed-precondition', 'unavailable action');
                break;
        }
    } catch (error) {
        return new Response('400', ' an error has occured', error);
    }
  
   
});

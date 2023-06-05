import * as functions from "firebase-functions";
//import * as admin from "firebase-admin";
//import {getFirestore} from "firebase-admin/firestore";
import {toTransfert} from "./utils/global_functions";
import { info} from "firebase-functions/logger";
import {createTransfert, getAllTransfert, getOneTransfert, deleteTransfert, updateTransfert } from "./funts";
import { Response } from "./types/response";
import { check_auth, check_role, check_transfert } from "./utils/global_checker";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

const CLIENT_ROLE = process.env.CLIENT_ROLE || 'CLIENT'
const ADMIN_ROLE = process.env.ADMIN_ROLE || "ADMIN"
const GESTIONNAIRE_ROLE = process.env.GESTIONNAIRE_ROLE || "GESTIONNAIRE"
const AGENT_ROLE = process.env.AGENT_ROLE || "AGENT"

const SAVE_ROLE = [CLIENT_ROLE];
const UPDATE_ROLE = [CLIENT_ROLE,ADMIN_ROLE,GESTIONNAIRE_ROLE];
const DELETE_ROLE = [CLIENT_ROLE,ADMIN_ROLE,GESTIONNAIRE_ROLE];
const ALL_ROLE = [CLIENT_ROLE,ADMIN_ROLE,GESTIONNAIRE_ROLE,AGENT_ROLE];

type availableAction = "SAVE" | "DELETE" | 'GET-INFO' | 'GET-ALL' | 'UPDATE';

exports.nlManageRequest = functions.https.onCall(async (data, context) => {
    info(data);
    check_auth(context);
    let transfert:any;
    try {
        if(data.transfert){
            transfert = await toTransfert(data.transfert, context);
        }
        const action:availableAction = data.action;
        switch (action) {
            case 'SAVE':
                check_transfert(transfert);
                await check_role(context,SAVE_ROLE);
                return createTransfert(transfert);
            case 'GET-ALL':
                await check_role(context, ALL_ROLE);
                return getAllTransfert(context);
            case 'GET-INFO':
                await check_role(context, ALL_ROLE);
                return getOneTransfert(data.transfertId);
            case 'DELETE':
                await check_role(context, DELETE_ROLE);
                return deleteTransfert(data.transfertId);
            case 'UPDATE':
                await check_role(context, UPDATE_ROLE);
                return updateTransfert(transfert, data.transfertId);
            default:
                throw new functions.https.HttpsError('failed-precondition', 'unavailable action');
                break;
        }
    } catch (error:any) {
        return new Response("400", error.message, error.code);
    }
  
   
});

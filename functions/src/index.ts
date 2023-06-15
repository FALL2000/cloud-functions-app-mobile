import * as functions from "firebase-functions";
//import * as admin from "firebase-admin";
//import {getFirestore} from "firebase-admin/firestore";
import {toTransfert} from "./utils/global_functions";
import { info} from "firebase-functions/logger";
import {createTransfert, getAllTransfert, getOneTransfert, deleteTransfert, updateTransfert } from "./funts";
import { Response } from "./types/response";
import { UserRole } from "./enum/role_enum";
import { check_auth, check_role, check_transfert } from "./utils/global_checker";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript



const SAVE_ROLE = [UserRole.Client];
const UPDATE_ROLE = [UserRole.Client,UserRole.Admin,UserRole.Gestionnaire];
const DELETE_ROLE = [UserRole.Client,UserRole.Admin,UserRole.Gestionnaire];
const ALL_ROLE = [UserRole.Client,UserRole.Admin,UserRole.Agent,UserRole.Gestionnaire];

type availableAction = "SAVE" | "DELETE" | 'GET-INFO' | 'GET-ALL' | 'UPDATE';

exports.nl_manage_request = functions.https.onCall(async (data, context) => {
    info(data);
    let transfert:any;
    try {
        check_auth(context);
        if(data.transfert){
            transfert = await toTransfert(data.transfert, context);
        }
        const action:availableAction = data.action;
        switch (action) {
            case 'SAVE':
                check_transfert(transfert);
                await check_role(context,SAVE_ROLE);
                return await createTransfert(transfert);
            case 'GET-ALL':
                await check_role(context, ALL_ROLE);
                return await getAllTransfert(context);
            case 'GET-INFO':
                await check_role(context, ALL_ROLE);
                return await getOneTransfert(data.transfertId);
            case 'DELETE':
                await check_role(context, DELETE_ROLE);
                return await deleteTransfert(data.transfertId);
            case 'UPDATE':
                await check_role(context, UPDATE_ROLE);
                return await updateTransfert(transfert, data.transfertId);
            default:
                throw new functions.https.HttpsError('failed-precondition', 'unavailable action');
                break;
        }
    } catch (error:any) {
        return Response.error(error);
    }
  
   
});

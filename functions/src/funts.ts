import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
//import { info} from "firebase-functions/logger";
import * as functions from "firebase-functions";
import { Transfert } from "./types/transfert";
import { getJpaTransfert } from "./jpa/transfert-jpa";
import { getApprovalJpa } from "./jpa/approval-jpa";
import { getJpaUsers } from "./jpa/users-jpa";
import { Response } from "./types/response";
import { StatusTranfert } from "./enum/status_enum";
import { StatusApproval } from "./enum/approval_status";
import { UserRole } from "./enum/role_enum";

const app=admin.initializeApp({},'appFunct');
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
const transfertJPA= getJpaTransfert(db);
const approvalJPA= getApprovalJpa(db);
const usersJPA= getJpaUsers(db);

const createTransfert = async (transfert: Transfert) => {
    let transInsert = await transfertJPA.create(transfert);
    let res = new Response();
    res.body = transInsert.id;
    res.message = "Transfert Created";
    return res;
}

const getAllTransfert = async (context:any,isAdmin:boolean) => {
    let transferts = isAdmin ? await transfertJPA.getAll() : await transfertJPA.findByUser(context.auth?.uid);
    let res = new Response();
    res.body = transferts;
    res.message = "All Tranfert";
    return res;
}

const getOneTransfert = async (transfertId:string) => {
    let transferts = await transfertJPA.getOne(transfertId);
    let approval = await approvalJPA.findByTransfert(transfertId);
    let res = new Response();
    res.message = "Transfert Info";
    if(transferts.get('status') == StatusTranfert.Open || approval == null){
        res.body = {...transferts.data(), id: transferts.id}
    }else{
        res.body = {...transferts.data(), id: transferts.id, approval:approval}
    }
    return res;
}

const deleteTransfert = async (transfertId:string) => {
    let transferts = await transfertJPA.delete(transfertId);
    let res = new Response();
    res.body = transferts;
    res.message = "Transfert Deleted";
    return res;
}

const updateTransfert = async (transfert: Transfert, transfertId:string) => {
    let transUpdate = await transfertJPA.put(transfertId,transfert);
    let res = new Response();
    res.body = transUpdate;
    res.message = "Transfert Updated";
    return res;
}

const updateStatusApproval = async (approvalId:string, status:any, context:any) => {
    const  statusApp = [StatusApproval.Open, StatusApproval.InApproval, StatusApproval.InProgress, StatusApproval.Approved, StatusApproval.Rejected, StatusApproval.Canceled, StatusApproval.ClosedWon, StatusApproval.Error, StatusApproval.Terminate];
    let res = new Response();
    res.message = "Status Approval Updated";
    if(statusApp.includes(status)){
        let user = await usersJPA.getOne(context.auth?.uid);
        if(status == StatusApproval.Terminate && user.role == UserRole.Agent){
            res.body = await approvalJPA.updateStatus(approvalId, status)
        }else{
            throw new functions.https.HttpsError('failed-precondition', 'This Status is not valid for role AGENT');
        }
        if((status == StatusApproval.Approved || status == StatusApproval.Rejected) && user.role == UserRole.Client){
            res.body = await approvalJPA.updateStatus(approvalId, status)
        }else{
            throw new functions.https.HttpsError('failed-precondition', 'This Status is not valid for role CLIENT');
        }
    }else{
        throw new functions.https.HttpsError('failed-precondition', 'Status Approval is not valid');
    }
    return res;
}

export {createTransfert, getAllTransfert, getOneTransfert, deleteTransfert, updateTransfert, updateStatusApproval};




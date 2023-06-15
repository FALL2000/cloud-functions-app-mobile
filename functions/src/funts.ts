import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
//import { info} from "firebase-functions/logger";
import { Transfert } from "./types/transfert";
import { getJpaTransfert } from "./jpa/transfert-jpa";
import { Response } from "./types/response";

const app=admin.initializeApp({},'appFunct');
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
const transfertJPA= getJpaTransfert(db);

const createTransfert = async (transfert: Transfert) => {
    let transInsert = await transfertJPA.create(transfert);
    let res = new Response();
    res.body = transInsert.id;
    res.message = "Transfert Created";
    return res;
}

const getAllTransfert = async (context:any) => {
    let transferts = await transfertJPA.findByUser(context.auth?.uid);
    let res = new Response();
    res.body = transferts;
    res.message = "All Tranfert";
    return res;
}

const getOneTransfert = async (transfertId:string) => {
    let transferts = await transfertJPA.getOne(transfertId);
    let res = new Response();
    res.body = transferts;
    res.message = "Transfert Info";
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

export {createTransfert, getAllTransfert, getOneTransfert, deleteTransfert, updateTransfert};




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
    return new Response('201', 'success', transInsert.id);
}

const getAllTransfert = async (context:any) => {
    let transferts = await transfertJPA.findByUser(context.auth?.uid);
    return new Response('200', 'success', transferts);
}

const getOneTransfert = async (transfertId:any) => {
    let transferts = await transfertJPA.getOne(transfertId);
    return new Response('200', 'success', transferts);
}

const deleteTransfert = async (transfertId:any) => {
    let transferts = await transfertJPA.delete(transfertId);
    return new Response('200', 'success', transferts);
}

export {createTransfert, getAllTransfert, getOneTransfert, deleteTransfert};




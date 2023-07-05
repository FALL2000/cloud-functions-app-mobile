import { Transfert } from "../types/transfert";
import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { match_algo } from "../utils/algoMatch";
import { getJpaTransfert } from "../jpa/transfert-jpa";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
// const transfertJPA= getJpaTransfert(db);
const transfertJPA= getJpaTransfert(db);

const findMatch = async (transfert:Transfert, amount:number):Promise<any>=>{
    const potentialReqs = await transfertJPA.getPotentailRequests(amount, transfert.inZoneId, transfert.outZoneId);
}

export {findMatch}
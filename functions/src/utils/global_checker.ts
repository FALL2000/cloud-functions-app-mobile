import * as functions from "firebase-functions";
import { getJpaUsers } from "../jpa/users-jpa";
import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { Transfert } from "../types/transfert";


const app=admin.initializeApp({}, 'appCheck');
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })

const check_auth = (context:any) =>{
    if (!context.auth) {throw new functions.https.HttpsError('unauthenticated', 'Authentification not found');}
}
const check_role = async (context:any, availableRole:Array<string>) :Promise<any>=>{
    let role:any;
    let jpaUsers = getJpaUsers(db);
    await jpaUsers.getOne(context.auth?.uid).then(
        (result) => {
            role =  result.role;
        }
    );
    if (!availableRole.includes(role)) {
        throw new functions.https.HttpsError('permission-denied', 'you do not have permission for do this');
    }
    return role
}

const check_transfert = (transfert:Transfert) => {
    if(!transfert.bank && !transfert.receiver){
        throw new functions.https.HttpsError('failed-precondition', 'Transfert must have a receiver or a bank');
    }
    if(transfert.inZone && transfert.outZone){
        if(transfert.inZone.code === transfert.outZone.code){
            throw new functions.https.HttpsError('failed-precondition', 'inZoneCity and outZoneCity can not have a same value');
        }
    }else{
        throw new functions.https.HttpsError('failed-precondition', 'Transfert must have inZone and outZone city');
    }

    if(!transfert.amount){
        throw new functions.https.HttpsError('failed-precondition', 'Transfert must have an amount');
    }
    if(!transfert.status){
        throw new functions.https.HttpsError('failed-precondition', 'Transfert must have an status');
    }
}

export {check_auth, check_role, check_transfert};


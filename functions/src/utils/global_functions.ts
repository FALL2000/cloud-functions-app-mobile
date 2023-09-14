import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { Transfert } from "../types/transfert";
import { getJpaCity } from "../jpa/city-jpa";
import { info} from "firebase-functions/logger";
import { getJpaUsers } from "../jpa/users-jpa";

const app=admin.initializeApp({}, 'appGlobalFunc');
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })

const toTransfert = async (data:any, context:any) => {
    info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ toTransfert');
    let users:any;
    let usersJPA = getJpaUsers(db);
    let cityJPA = getJpaCity(db);
    await usersJPA.getOne(context.auth?.uid).then(
        (result) => {
            users =  {"ownerId":result.Id,...result}
        }
    );
    let transfert = new Transfert();
    transfert.fromJson(data);
    transfert.setOwnerId(users.ownerId); 
    transfert.owner=users; 
    if(data.inZoneCity){
        await cityJPA.findByCode(data.inZoneCity).then(
            (result) => {
                transfert.setInZone(result);
            }
        );
    }
    if(data.outZoneCity){
        await cityJPA.findByCode(data.outZoneCity).then(
            (result) => {
                transfert.setOutZone(result);
            }
        );
    }
    return transfert; 
}
const completeTransfert = async (data:any, context:any) => {

    info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ toTransfert');
    const _transfert:any={...data};
    let users:any;
    let usersJPA = getJpaUsers(db);
    let cityJPA = getJpaCity(db);
    await usersJPA.getOne(context.auth?.uid).then(
        (result) => {
            users =  {"ownerId":result.Id,...result}
        }
    );

    let transfert = new Transfert();
    transfert.fromJson(data);
    transfert.setOwnerId(users.ownerId); 
    transfert.owner=users; 
     
    if(data.inZoneCity){
        await cityJPA.findByCode(data.inZoneCity).then(
            (result) => {
                transfert.setInZone(result);
                _transfert.inZone=transfert.inZone;
                
            }
        );
    }
    if(data.outZoneCity){
        await cityJPA.findByCode(data.outZoneCity).then(
            (result) => {
                transfert.setOutZone(result);
                _transfert.outZone=transfert.outZone;
            }
        );
    }

    _transfert.ownerId=context.auth?.uid; 
    _transfert.owner=users;
    return _transfert; 
}
const updateField = function (transfert:any) {
    let fieldUpdate:any = {};
    for (const key in transfert) {
        if(transfert[key] !== null && transfert[key] !== '') {
            fieldUpdate[key] = transfert[key];
        }
    }
    info(fieldUpdate);
    return fieldUpdate;
}

export {toTransfert, updateField,completeTransfert};
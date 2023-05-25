import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { Transfert } from "../types/transfert";
import { getJpaCity } from "../jpa/city-jpa";
import { getJpaUsers } from "../jpa/users-jpa";

const app=admin.initializeApp({}, 'appGlobalFunc');
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })

const toTransfert = async (data:any, context:any) => {
    let users:any;
    let jpaUsers = getJpaUsers(db);
    let jpaCity = getJpaCity(db);
    await jpaUsers.getOne(context.auth?.uid).then(
        (result) => {
            users =  {"owner":result.users, "ownerId":result.Id}
        }
    );
    let transfert = new Transfert();
    transfert.fromJson(data);
    transfert.setOwner(users.owner);
    transfert.setOwnerId(users.ownerId);
    await jpaCity.findByCode(transfert.inZoneCity).then(
        (result) => {
            transfert.setInZone(result);  
        }
    );
    await jpaCity.findByCode(transfert.outZoneCity).then(
        (result) => {
            transfert.setOutZone(result); 
        }
    );  
    return transfert; 
}

export {toTransfert};
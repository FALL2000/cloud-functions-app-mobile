import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
//import { City } from "../types/city";
import { Transfert } from "../types/transfert";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
const USERS_COLLECTION = 'users';
const CITY_COLLECTION = 'City';

const getUsersById = async (uid:any) => {
  const usersRef = db.collection(USERS_COLLECTION).doc(uid);
  const doc = await usersRef.get();
  return {
      "ownerId":doc.id,
      "owner":doc.data()
    };
}

const getCityByCode = async (codeCity:string) => {
    let dataTab:any=[];
    const usersRef = db.collection(CITY_COLLECTION);
    const snapshot = await usersRef.where('code', '==', codeCity).get();
    snapshot.forEach(doc => {
        dataTab.push(doc.data());
    });
    return dataTab[0];
}

const toTransfert = async (data:any, uid:any) => {
    let users:any;
    await getUsersById(uid).then(
        (result) => {
            users =  {"owner":result.owner, "ownerId":result.ownerId}
        }
    );
    let transfert = new Transfert();
    transfert.fromJson(JSON.parse(data));
    transfert.setOwner(users.owner);
    transfert.setOwnerId(users.ownerId);
    await getCityByCode(transfert.inZoneCity).then(
        (result) => {
            transfert.setInZone(result);  
        }
    );
    await getCityByCode(transfert.outZoneCity).then(
        (result) => {
            transfert.setOutZone(result); 
        }
    );  
    return transfert; 
}

export {getUsersById, getCityByCode, toTransfert};
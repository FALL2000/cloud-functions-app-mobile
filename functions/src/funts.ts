import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
//import { info} from "firebase-functions/logger";
//import { Transfert } from "./types/transfert";
//import { getJpaTransfert } from "./jpa/transfert-jpa";
import { getJpaMutex } from "./jpa/mutex-jpa";
import { Transfert } from "./types/transfert";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
// const transfertJPA= getJpaTransfert(db);
const mutexJPA= getJpaMutex(db);

const  isRunning =  async (univers:string):Promise<boolean> => {
    let mutex = await mutexJPA.getOne(univers);
    if(mutex == null){
        return false
    }else{
        return mutex.isRunning;
    }
}

const  updateMutex = async (isRunning:boolean)=>{
    // const _mutex={ id: univers,isRunning }
    // upsert _mutex
}

export {isRunning, updateMutex};




import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
//import { info} from "firebase-functions/logger";
//import { City } from "./types/city";
//import { Transfert } from "./types/transfert";

const app=admin.initializeApp();
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })
//const TRANSFERT_COLLECTION = 'transferts';

//const createTransfert = ()




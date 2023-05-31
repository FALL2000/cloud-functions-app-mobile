import * as functions from "firebase-functions";
import { getJpaUsers } from "../jpa/users-jpa";
import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";


const app=admin.initializeApp({}, 'appCheck');
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true })

const check_auth = (context:any) =>{
    if (!context.auth) {throw new functions.https.HttpsError('unauthenticated', 'Authentification not found');}
}
const check_role = async (context:any, availableRole:Array<string>) =>{
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
}

export {check_auth, check_role};


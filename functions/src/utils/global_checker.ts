import * as functions from "firebase-functions";

const check_auth = (context:any) =>{
    if (!context.auth) {throw new functions.https.HttpsError('unauthenticated', 'Authentification not found');}
}
const check_role = (role:string, availableRole:Array<string>) =>{
    if (availableRole.includes(role)) {
        throw new functions.https.HttpsError('permission-denied', 'you do not have permission for do thi');
    }
}


export {check_auth, check_role};


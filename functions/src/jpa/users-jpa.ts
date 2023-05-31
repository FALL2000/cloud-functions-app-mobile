import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
const USERS_COLLECTION= process.env.USERS_COLLECTION || 'users';


export class Jpausers {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    public async getOne(usersId:any){
        const users =  await this.db.collection(USERS_COLLECTION).doc(usersId).get();
        if (!users.exists) {
              throw new functions.https.HttpsError('not-found', 'Users Not Found!');
        }else{
            return { "Id":users.id, "role":users.get('role')};
        }
    }
}

export function getJpaUsers(db: Firestore): Jpausers {
    return new Jpausers(db);
};

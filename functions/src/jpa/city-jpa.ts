import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
const CITY_COLLECTION= process.env.CITY_COLLECTION || 'City';

export class Jpacity {
    public db:Firestore;
    public constructor(db: Firestore){
        this.db = db;
    }

    public async findByCode(codeCity:any){
        let dataTab:any=[];
        const snapshot = await this.db.collection(CITY_COLLECTION).where('code', '==', codeCity).get();
        if (snapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'City Not Found');
        } 
        snapshot.forEach(doc => {
            dataTab.push(doc.data());
        });
         return dataTab[0];
    }
}

export function getJpaCity(db: Firestore): Jpacity {
    return new Jpacity(db);
};
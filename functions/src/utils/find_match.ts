import { Transfert } from "../types/transfert";
import { Firestore } from "firebase-admin/firestore";
import { match_algo } from "../utils/algoMatch";
import { getJpaTransfert } from "../jpa/transfert-jpa";


export class Match{
    transfert: Transfert;
    amount: number;
    public db:Firestore;

    public constructor(db: Firestore, transfert: Transfert, amount: number){
        this.db = db;
        this.transfert = transfert;
        this.amount = amount;
    }
    public findMatch = async ():Promise<any>=>{
        const potentialReqs = await getJpaTransfert(this.db).getPotentailRequests(this.amount, this.transfert.inZoneId, this.transfert.outZoneId);
        if(potentialReqs.length > 0){
            let suitableList= match_algo(potentialReqs, this.transfert, this.amount)
            if(await this.checkRequest(suitableList)){
                return true
            }
            return false
        }
        return false
    }
    
    public checkRequest= async (suitableList:any)=>{
         const transferts = await getJpaTransfert(this.db).getMany(suitableList, this.amount, this.transfert);
         let valeurInitiale = 0;
         let somme = transferts.reduce(
              (accumulateur, valeurCourante) => accumulateur + valeurCourante.amount, valeurInitiale);
        return somme == this.amount ? true : false;
    }
}
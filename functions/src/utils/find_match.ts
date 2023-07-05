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
    public findMatch = async (transfert:Transfert, amount:number):Promise<any>=>{
        const potentialReqs = await getJpaTransfert(this.db).getPotentailRequests(amount, transfert.inZoneId, transfert.outZoneId);
        if(potentialReqs){
            let suitableList= match_algo(potentialReqs, transfert, amount)
            if(await this.checkRequest(suitableList, amount, transfert)){
                return true
            }
            return false
        }
        return false
    }
    
    public checkRequest= async (suitableList:any, amount: number, transfert:Transfert)=>{
         const transferts = await getJpaTransfert(this.db).getMany(suitableList, amount, transfert);
         let valeurInitiale = 0;
         let somme = transferts.reduce(
              (accumulateur, valeurCourante) => accumulateur + valeurCourante.amount, valeurInitiale);
        return somme == amount ? true : false;
    }
}
import { Transfert } from "../types/transfert";
import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { match_algo } from "../utils/algoMatch";
import { getJpaTransfert } from "../jpa/transfert-jpa";
import { TransactionManager } from "./manage_transaction";
type FROM_TYPE= 'COMPLEXE' | 'SIMPLE'

export class Match{
    transfert: Transfert;
    amount: number;
    public db:Firestore;
    from?: FROM_TYPE='SIMPLE'
    public constructor(db: Firestore, transfert: Transfert, amount: number,from?: FROM_TYPE){
        this.db = db;
        this.transfert = transfert;
        this.amount = amount;
        this.from=from
    }
    public findMatch = async ():Promise<any>=>{
        const potentialReqs = await getJpaTransfert(this.db).getPotentailRequests(this.amount, this.transfert.inZoneId, this.transfert.outZoneId);
        if(potentialReqs.length > 0){
            let suitableList= match_algo(potentialReqs, this.transfert, this.amount)
            if(await this.checkRequest(suitableList)){
                suitableList.unshift(this.transfert)
                const transactionManager= new TransactionManager(this.db,suitableList,this.from) 
                const approvalRequests=transactionManager.openTransaction();
                //call notif service with this list of approval requests;
                return true
            }
            return false
        }
        return false
    }
    
    public checkRequest= async (suitableList:any):Promise<boolean>=>{

        const transfertJPA=getJpaTransfert(this.db);

        const __transfert:Transfert=await transfertJPA.getOne(this.transfert?.id);
        if(!this.check(__transfert)){ throw new functions.https.HttpsError('not-found', 'findMatch::checkRequest::check:::Data Compromized'); }
        this.transfert=__transfert;

        const transferts = await transfertJPA.getMany(suitableList, this.amount, this.transfert);
        let valeurInitiale = 0;
        let somme = transferts.reduce(
            (accumulateur, valeurCourante) => accumulateur + valeurCourante.amount, valeurInitiale);

        return somme == this.amount ? true : false;
    }
    public check(_transfert:Transfert){
        return this.transfert.amount == _transfert.amount
                && this.transfert.inZoneId == _transfert.inZoneId
                && this.transfert.outZoneId == _transfert.outZoneId
    }
}
import { typeNotification } from "../enum/notif_type";

type modeType= 'INDIVIDUAL'| 'MASS ' 
export class Message{
    type: typeNotification=typeNotification.Approbation;
    mode: modeType='INDIVIDUAL';
    body?: any;
    constructor(){ 
    }
    public static BuidApprovalMessageMultiple(listApproval:any[]){
        const message = new Message()
        message.body=listApproval;
        message.type=typeNotification.Approbation;
        message.mode='INDIVIDUAL';
        return message;
    }
}
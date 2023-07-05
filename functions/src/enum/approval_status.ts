import { StatusTranfert } from "./status_enum";

export enum StatusApproval  {
    InApproval = 'IN APPROVAL',//send to client
    InProgress = 'IN PROGRESS',//took in charge by agent 
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    Canceled = 'CANCELED',
    ClosedWon = 'CLOSED WON',
}
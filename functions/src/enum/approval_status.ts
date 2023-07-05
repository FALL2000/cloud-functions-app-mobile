
export enum StatusApproval  {
    Open = 'NEW',//send to client
    InApproval = 'IN APPROVAL',//send to client
    InProgress = 'IN PROGRESS',//took in charge by agent 
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    Canceled = 'CANCELED',
    ClosedWon = 'CLOSED WON',
}
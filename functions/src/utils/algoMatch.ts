import { Transfert } from "../types/transfert";

const AMOUNT_FIELD = 'amount'
const MAX_COUPLE_SIZE=3

const match_algo = (transfertsList:any,transfert:Transfert, amount:number)=>{
    const theAmount = amount;
    let tabCouple:any[] = [];
    let max=0;

    for(const key in transfertsList){
        const currentValue= transfertsList[key].amount
        const currentElement= transfertsList[key]
        const res= theAmount-currentValue
        const founded=res==0
        const valids=[];
        if( currentValue<=max ){
            tabCouple = tabCouple.map((elt,ind) => {
    
                let _item={...try_adding(currentElement,elt)}
                const _max= _item.maxRemaining
                max=(max < _max ) ? _max : max
                return _item;
            })
        }
        if(founded){
            valids.push([currentElement])
        }
        const currentItem={
            maxRemaining:res,
            couples:[
                { 
                    items:[currentElement],
                    remains:res,
                }
            ],
            valids,
            founded
        }
        tabCouple.push( currentItem);

        max =(max < res ) ? res : max
    }
    const _tabCouple= tabCouple.filter(item=>item.founded).map(couple => {
        /*const match= {
            out:[...[...couple.valids].map(item=>item.id)],
            in : transfert,
        }*/
        return [...couple.valids]
    });
    const suitableList = findBestCouple(flatten(_tabCouple));
    return suitableList;
}
const flatten= (tab:any[][])=>{
    return tab.reduce((accumulator, subArray) => accumulator.concat(subArray), []);
}


const try_adding = (currReq:any,item:any)=>{
    const maxRemaining = item?.maxRemaining || -1
    const _item={..._add(currReq,maxRemaining,item.couples,item.valids,item.founded)}
    return _item;
}

const _add=(currElement:any,maxRemaining:any,couples:any,valids:any,founded:boolean)=>{
    let max=maxRemaining;
    const currentValue=currElement[AMOUNT_FIELD];
    const _couples=[...couples];
    let _valids=[...valids];
    couples.forEach(function(couple:any){
        const _res= couple.remains - currentValue;
        if( _res >=0  && couple?.items.length < MAX_COUPLE_SIZE){
            let tab={items:[...couple.items], remains:_res}
            tab.items?.push(currElement)
            //tab.remains= _res;
            _couples.push(tab);
            max=(max < _res ) ? _res :max
            if (_res==0) {
                founded=true;
                _valids.push(tab.items);
            }
        }
    });

    return {
        couples:_couples,
        maxRemaining: max,
        valids:_valids,
        founded
    }

}

const findBestCouple = (tabCouple:any)=>{
    let lengthMin = tabCouple[0].length;
    let suitableList = tabCouple[0];
    for(const key in tabCouple){
        if(tabCouple[key].length < lengthMin){
            suitableList = tabCouple[key];
            lengthMin = tabCouple[key].length;
        }
    }
    return suitableList;
}

export {match_algo}
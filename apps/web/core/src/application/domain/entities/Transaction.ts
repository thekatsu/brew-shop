export enum TRANSACTION_TYPE {
    INCOMING,
    INCOMING_REVERSAL
}

export default abstract class Transaction{
    private type:TRANSACTION_TYPE
    protected value:number
    
    constructor(type:TRANSACTION_TYPE, value:number){
        this.type = type
        if(value <= 0 ) throw new Error("A transação precisa ter um valor maior que zero!")
        this.value = value
    }

    getType():TRANSACTION_TYPE{
        return this.type
    }

    abstract getValue():number
}

export class TransactionIncoming extends Transaction{
    constructor(value:number){
        super(TRANSACTION_TYPE.INCOMING, value)
    }

    getValue():number{
        return this.value
    }
}

export class TransactionIncomingReversal extends Transaction{
    constructor(value:number){
        super(TRANSACTION_TYPE.INCOMING_REVERSAL, value)
    }

    getValue():number{
        return -this.value
    }
}
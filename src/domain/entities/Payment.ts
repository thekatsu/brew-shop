export enum PAYMENT_STATUS {
    OPEN,
    PAID,
    CANCELED
}

export default class Payment{
    private status:PAYMENT_STATUS = PAYMENT_STATUS.OPEN
    constructor(private invoiceCode: string, private sequence: number, private value: number){}

    getStatus(): PAYMENT_STATUS{
        return this.status
    }

    getSequence(){
        return this.sequence
    }

    getValue():number{
        return this.value
    }

    setValue(value:number){
        this.value = value
    }

    pay():void{
        this.status = PAYMENT_STATUS.PAID
    }

    cancel(){
        if(this.getStatus() === PAYMENT_STATUS.PAID) throw new Error("Parcelas pagas não podem ser canceladas!")
        this.status = PAYMENT_STATUS.CANCELED
    }
}
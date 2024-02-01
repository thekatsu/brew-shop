export enum INSTALLMENT_STATUS {
    OPEN,
    PAID,
    CANCELED
}

export default class Installment{
    private status:INSTALLMENT_STATUS = INSTALLMENT_STATUS.OPEN
    constructor(private invoiceCode: string, private sequence: number, private value: number){}

    getStatus(): INSTALLMENT_STATUS{
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
        this.status = INSTALLMENT_STATUS.PAID
    }

    cancel(){
        if(this.getStatus() === INSTALLMENT_STATUS.PAID) throw new Error("Parcelas pagas não podem ser canceladas!")
        this.status = INSTALLMENT_STATUS.CANCELED
    }
}
import { randomUUID } from 'crypto'
import GuestCheckPad from "./GuestCheckPad";
import Installment, { INSTALLMENT_STATUS } from "./Installment";

export enum PAYMENT_STATUS {
    OPEN,
    PAID,
    CANCELED
}

export default class Payment {
    private total: number = 0
    private totalOpen: number = 0
    private status: PAYMENT_STATUS
    
    private constructor(private code: string, private guestCheckPads: GuestCheckPad[], private installments: Installment[] = []){
        this.status = PAYMENT_STATUS.OPEN
        this.calculateTotal()
        if(installments.length > 0){
            this.setInstallments(installments)
        } else {
            this.generateInstallments(1)
        }
        this.calculateTotalOpen()
    }

    public static create(guestCheckPads: GuestCheckPad[], numberOfInstallments: number = 1): Payment{
        let code = randomUUID()
        let payment = new Payment(code, guestCheckPads)
        payment.generateInstallments(numberOfInstallments)
        return payment
    }

    public static restore(code: string, guestCheckPads: GuestCheckPad[], installments: Installment[]): Payment{
        return new Payment(code, guestCheckPads, installments)
    }

    getCode():string{
        return this.code
    }

    getStatus():PAYMENT_STATUS{
        return this.status
    }

    private calculateTotal():void{
        this.total = 0 
        this.guestCheckPads.forEach((guestCheckPad)=>{
            this.total += guestCheckPad.getTotal()
        })
    }

    getTotal():number{
        return this.total
    }

    private calculateTotalOpen():void{
        this.totalOpen = this.total - this.getTotalInstallmentsPaid()
    }

    getTotalOpen():number{
        return this.totalOpen
    }

    getGuestCheckPads():GuestCheckPad[]{
        return this.guestCheckPads
    }

    getInstallments():Installment[]{
        return this.installments
    }

    getTotalOutstandingInstallments():number{
        return this.installments
            .filter((installment)=>installment.getStatus() === INSTALLMENT_STATUS.OPEN)
            .map((installment)=>installment.getValue())
            .reduce((accumulador, current) => accumulador + current, 0)
    }

    getTotalInstallmentsPaid():number{
        return this.installments
            .filter((installment)=>installment.getStatus() === INSTALLMENT_STATUS.PAID)
            .map((installment)=>installment.getValue())
            .reduce((accumulador, current) => accumulador + current, 0)
    }

    setInstallments(installments: Installment[]){
        this.installments = installments
    }

    private generateInstallments(numberOfInstallments:number):void{
        const baseValueOfInstallment = Math.round((this.total/numberOfInstallments)*100)/100
        let sumOfInstallments = 0
        this.installments = this.installments.filter((installment)=>installment.getStatus() === INSTALLMENT_STATUS.PAID)
        for(let i = 1; i <= numberOfInstallments; i++ ){
            let value = baseValueOfInstallment
            if(i === numberOfInstallments){
                if(sumOfInstallments + value > this.totalOpen){
                    value -= (sumOfInstallments + value) - this.totalOpen
                } else {
                    value += this.totalOpen - (sumOfInstallments + value)
                }
            }
            sumOfInstallments +=  Math.round(value*100)/100
            this.installments.push(new Installment(this.code, i, Math.round(value*100)/100))
        }
    }

    payInstallment(sequence: number){
        this.installments = this.installments
            .map((installment)=>{
                if(installment.getSequence() === sequence) {
                    installment.pay()
                }
                return installment
            })
        this.calculateTotalOpen()
        if(this.totalOpen === 0) this.status = PAYMENT_STATUS.PAID
    }

    alterInstallment(sequence: number, value: number){
        this.installments = this.installments
            .map((installment)=>{
                if(installment.getSequence() === sequence) {
                    if((this.totalOpen - installment.getValue()) + value > this.totalOpen) throw new Error("O valor excede o total em aberto!")
                    installment.setValue(value)
                }
                return installment
            })
        this.calculateTotalOpen()
    }

    cancel(){
        if(this.getStatus() === PAYMENT_STATUS.PAID) throw new Error("Pagamento com o status pago não pode ser cancelado!")
        this.installments = this.installments
            .map((installment)=>{
                if(installment.getStatus() == INSTALLMENT_STATUS.OPEN) installment.cancel()
                return installment
            })
        this.status = PAYMENT_STATUS.CANCELED
    }
}
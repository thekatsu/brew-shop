import { randomUUID } from 'crypto'
import Order from "./Order";
import Installment, { INSTALLMENT_STATUS } from './Installment';

export enum INVOICE_STATUS {
    OPEN,
    PAID,
    CANCELED
}

export default class Invoice {
    private total: number = 0
    private totalOpen: number = 0
    private status: INVOICE_STATUS
    
    private constructor(private code: string, private orders: Order[], private installments: Installment[] = []){
        this.status = INVOICE_STATUS.OPEN
        this.calculateTotal()
        if(installments.length > 0){
            this.setInstallments(installments)
        } else {
            this.generateInstallments(1)
        }
        this.calculateTotalOpen()
    }

    public static create(orders: Order[], numberOfInstallments: number = 1): Invoice{
        let code = randomUUID()
        let invoice = new Invoice(code, orders)
        invoice.generateInstallments(numberOfInstallments)
        return invoice
    }

    public static restore(code: string, orders: Order[], installments: Installment[]): Invoice{
        return new Invoice(code, orders, installments)
    }

    getCode():string{
        return this.code
    }

    getStatus():INVOICE_STATUS{
        return this.status
    }

    private calculateTotal():void{
        this.total = 0 
        this.orders.forEach((Order)=>{
            this.total += Order.getTotal()
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

    getOrders():Order[]{
        return this.orders
    }

    getInstallments():Installment[]{
        return this.installments
    }

    getTotalOutstandingInstallments():number{
        return this.installments
            .filter((payment)=>payment.getStatus() === INSTALLMENT_STATUS.OPEN)
            .map((payment)=>payment.getValue())
            .reduce((accumulador, current) => accumulador + current, 0)
    }

    getTotalInstallmentsPaid():number{
        return this.installments
            .filter((payment)=>payment.getStatus() === INSTALLMENT_STATUS.PAID)
            .map((payment)=>payment.getValue())
            .reduce((accumulador, current) => accumulador + current, 0)
    }

    setInstallments(installments: Installment[]){
        this.installments = installments
    }

    private generateInstallments(numberOfInstallments:number):void{
        const baseValueOfInstallment = Math.round((this.total/numberOfInstallments)*100)/100
        let sumOfInstallments = 0
        this.installments = this.installments.filter((payment)=>payment.getStatus() === INSTALLMENT_STATUS.PAID)
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
            .map((payment)=>{
                if(payment.getSequence() === sequence) {
                    payment.pay()
                }
                return payment
            })
        this.calculateTotalOpen()
        if(this.totalOpen === 0) this.status = INVOICE_STATUS.PAID
    }

    alterInstallment(sequence: number, value: number){
        this.installments = this.installments
            .map((payment)=>{
                if(payment.getSequence() === sequence) {
                    if((this.totalOpen - payment.getValue()) + value > this.totalOpen) throw new Error("O valor excede o total em aberto!")
                    payment.setValue(value)
                }
                return payment
            })
        this.calculateTotalOpen()
    }

    cancel(){
        if(this.getStatus() === INVOICE_STATUS.PAID) throw new Error("Pagamento com o status pago não pode ser cancelado!")
        this.installments = this.installments
            .map((payment)=>{
                if(payment.getStatus() == INSTALLMENT_STATUS.OPEN) payment.cancel()
                return payment
            })
        this.status = INVOICE_STATUS.CANCELED
    }
}
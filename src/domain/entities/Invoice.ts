import { randomUUID } from 'crypto'
import Order from "./Order";
import Payment, { PAYMENT_STATUS } from "./Payment";

export enum INVOICE_STATUS {
    OPEN,
    PAID,
    CANCELED
}

export default class Invoice {
    private total: number = 0
    private totalOpen: number = 0
    private status: INVOICE_STATUS
    
    private constructor(private code: string, private orders: Order[], private payments: Payment[] = []){
        this.status = INVOICE_STATUS.OPEN
        this.calculateTotal()
        if(payments.length > 0){
            this.setPayments(payments)
        } else {
            this.generatePayments(1)
        }
        this.calculateTotalOpen()
    }

    public static create(orders: Order[], numberOfPayments: number = 1): Invoice{
        let code = randomUUID()
        let payment = new Invoice(code, orders)
        payment.generatePayments(numberOfPayments)
        return payment
    }

    public static restore(code: string, orders: Order[], payments: Payment[]): Invoice{
        return new Invoice(code, orders, payments)
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
        this.totalOpen = this.total - this.getTotalPaymentsPaid()
    }

    getTotalOpen():number{
        return this.totalOpen
    }

    getOrders():Order[]{
        return this.orders
    }

    getPayments():Payment[]{
        return this.payments
    }

    getTotalOutstandingPayments():number{
        return this.payments
            .filter((payment)=>payment.getStatus() === PAYMENT_STATUS.OPEN)
            .map((payment)=>payment.getValue())
            .reduce((accumulador, current) => accumulador + current, 0)
    }

    getTotalPaymentsPaid():number{
        return this.payments
            .filter((payment)=>payment.getStatus() === PAYMENT_STATUS.PAID)
            .map((payment)=>payment.getValue())
            .reduce((accumulador, current) => accumulador + current, 0)
    }

    setPayments(payments: Payment[]){
        this.payments = payments
    }

    private generatePayments(numberOfPayments:number):void{
        const baseValueOfPayment = Math.round((this.total/numberOfPayments)*100)/100
        let sumOfPayments = 0
        this.payments = this.payments.filter((payment)=>payment.getStatus() === PAYMENT_STATUS.PAID)
        for(let i = 1; i <= numberOfPayments; i++ ){
            let value = baseValueOfPayment
            if(i === numberOfPayments){
                if(sumOfPayments + value > this.totalOpen){
                    value -= (sumOfPayments + value) - this.totalOpen
                } else {
                    value += this.totalOpen - (sumOfPayments + value)
                }
            }
            sumOfPayments +=  Math.round(value*100)/100
            this.payments.push(new Payment(this.code, i, Math.round(value*100)/100))
        }
    }

    payInvoice(sequence: number){
        this.payments = this.payments
            .map((payment)=>{
                if(payment.getSequence() === sequence) {
                    payment.pay()
                }
                return payment
            })
        this.calculateTotalOpen()
        if(this.totalOpen === 0) this.status = INVOICE_STATUS.PAID
    }

    alterInvoice(sequence: number, value: number){
        this.payments = this.payments
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
        this.payments = this.payments
            .map((payment)=>{
                if(payment.getStatus() == PAYMENT_STATUS.OPEN) payment.cancel()
                return payment
            })
        this.status = INVOICE_STATUS.CANCELED
    }
}
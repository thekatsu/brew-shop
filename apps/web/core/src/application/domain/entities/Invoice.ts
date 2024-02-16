import { randomUUID } from 'crypto'
import Order from "./Order";
import Transaction, { TRANSACTION_TYPE, TransactionIncoming, TransactionIncomingReversal } from './Transaction';

export enum INVOICE_STATUS {
    OPEN,
    PAID,
    CANCELED,
    REVERSED
}

export default class Invoice {
    private invoiceId: string
    private orders: Order[] = []
    private payments: Transaction[]
    private status: INVOICE_STATUS
    
    private constructor(invoiceId: string, status: INVOICE_STATUS, orders: Order[], payments: Transaction[] = []){
        this.invoiceId = invoiceId
        orders.forEach((order)=>{
            order.close(this)
        })
        this.orders = orders
        this.payments = payments
        this.status = status
    }
    
    public static restore(invoiceId:string, status: INVOICE_STATUS, orders: Order[], payments: Transaction[]): Invoice{
        return new Invoice(invoiceId, status, orders, payments)
    }

    public static create(orders: Order[]): Invoice{
        const invoiceId = randomUUID()
        return new Invoice(invoiceId, INVOICE_STATUS.OPEN, orders)
    }

    getId():string{
        return this.invoiceId
    }

    getStatus():INVOICE_STATUS{
        return this.status
    }

    getTotal():number{
        return this.orders.reduce((accu, curr)=> accu + curr.getTotal(), 0)
    }

    getTotalOpen():number{
        return this.getTotal() - this.getTotalPaid()
    }

    getOrders():Order[]{
        return this.orders.map(order => order)
    }

    getPayments():Transaction[]{
        return this.payments.map(payment => payment)
    }

    getTotalPaid():number{
        return this.payments
            .reduce((accu, curr) => accu + curr.getValue(), 0)
    }

    pay(value:number){
        this.payments.push(new TransactionIncoming(value))
    }

    reversePayment(value:number){
        this.payments.push(new TransactionIncomingReversal(value))
    }

    cancel(){
        if(this.getTotalOpen() > 0) this.payments.push(new TransactionIncomingReversal(this.getTotalOpen()))
        this.orders.forEach(order => order.open())
        this.status = INVOICE_STATUS.CANCELED
    }

    addOrders(orders: Order[]){
        orders.forEach((newOrder)=>{
            const hasOrder = this.orders.some((invoiceOrder)=>{invoiceOrder.getId() === newOrder.getId()})
            if(!hasOrder) {
                newOrder.close(this)
                this.orders.push(newOrder)
            }
        })
    }

    removeOrders(orders: Order[]){
        orders.forEach((orderToRemove)=>{
            if(orderToRemove.getTotal() <= this.getTotalOpen()){
                this.orders = this.orders
                    .map((order)=>{
                        if(order.getId() === orderToRemove.getId()) order.open()
                        return order
                    })
                    .filter((order)=> order.getId() !== orderToRemove.getId())
            }
        })
    }

    simulateInstallments(numberOfInstallments:number):Transaction[]{
        const baseValueOfInstallment = Math.round((this.getTotalOpen()/numberOfInstallments)*100)/100
        const totalOpen = this.getTotalOpen()
        const installments = []
        let sumOfInstallments = 0
        for(let i = 1; i <= numberOfInstallments; i++ ){
            let value = baseValueOfInstallment
            if(i === numberOfInstallments){
                if(sumOfInstallments + value > totalOpen){
                    value -= (sumOfInstallments + value) - totalOpen
                } else {
                    value += totalOpen - (sumOfInstallments + value)
                }
            }
            sumOfInstallments +=  Math.round(value*100)/100
            installments.push(new TransactionIncoming(Math.round(value*100)/100))
        }
        return installments
    }
}
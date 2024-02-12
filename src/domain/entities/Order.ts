import { randomUUID } from 'crypto'
import Item from "./Item";
import Invoice from './Invoice';
import ItemOrderNotFound from '../errors/order/ItemOrderNotFound';
import OrderIsClosed from '../errors/order/OrderIsClosed';
import OrderCanNotBeOpen from '../errors/order/OrderCanNotBeOpen';

export enum ORDER_STATUS {
    OPEN,
    CLOSE
}

export default class Order{
    private orderId: string
    private description: string
    private status: ORDER_STATUS = ORDER_STATUS.OPEN
    private items: Item[] = []
    private invoice?: Invoice     
    
    private constructor(orderId: string, description: string, items: Item[], status: ORDER_STATUS, invoice?: Invoice){
        this.orderId = orderId
        this.description = description
        this.items = items
        this.invoice = invoice
        this.status = status
    }

    public static restore(orderId: string, description: string, items: Item[], status: ORDER_STATUS, invoice?: Invoice):Order{
        return new Order(orderId, description, items, status, invoice)
    }

    public static new(description?:string):Order{
        let orderId = randomUUID()
        if(!description) description = `Order: ${orderId}`
        return new Order(orderId, description, [], ORDER_STATUS.OPEN)
    }
    
    getOrderId():string{
        return this.orderId
    }

    getStatus():ORDER_STATUS{
        return this.status
    }

    private canClose(){
        return this.getStatus() == ORDER_STATUS.OPEN
    }

    close(invoice:Invoice):void{
        if(!this.canClose()) throw new OrderIsClosed()
        this.invoice = invoice
        this.invoice.addOrders([this])
        this.status = ORDER_STATUS.CLOSE
    }

    private detachInvoice(){
        if(!this.invoice) throw new Error("Sem fatura para ser desanexada!")
        this.invoice.removeOrders([this])
        this.invoice = undefined
    }

    isOpen(){
        return this.status === ORDER_STATUS.OPEN
    }
    
    open():void{
        if(this.isOpen()) throw new OrderCanNotBeOpen()
        this.detachInvoice()
        this.status = ORDER_STATUS.OPEN
    }

    getInvoice():Invoice | undefined{
        return this.invoice
    }

    getDescription():string {
        return this.description
    }

    getTotal():number {
        return this.items.reduce((total, curr)=> total + curr.getTotal(), 0)
    }

    getItems():Item[] {
        return this.items.map(value => value)
    }

    addItem(productId:string, value:number){
        if(!this.isOpen()) throw new OrderIsClosed("itens não podem ser adicionados")
        this.items.push(Item.create(productId, value))
    }

    removeItem(productId:string){
        if(!this.isOpen()) throw new OrderIsClosed("não pode ter items removidos")
        this.items = this.items.filter((item) => item.getProductId() !== productId)
    }

    increaseItemQuantity(productId: string, quantity: number = 1):void{
        if(!this.isOpen()) throw new OrderIsClosed("não pode ser modificada")
        const item = this.items.find((value) => value.getProductId() === productId)
        if(!item) throw new ItemOrderNotFound()
        item.quantityUp(quantity)
    }

    decreaseItemQuantity(productId: string, quantity:number = 1):void {
        if(!this.isOpen()) throw new OrderIsClosed("não pode ser modificada")
        const item = this.items.find((item)=>item.getProductId() === productId)
        if(!item) throw new ItemOrderNotFound()
        item.quantityDown(quantity)
        if(item.getQuantity() === 0){
            this.items = this.items.filter((item) => item.getProductId() === productId)
        }
    }
}
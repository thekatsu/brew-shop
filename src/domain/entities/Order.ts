import { randomUUID } from 'crypto'
import Item from "./Item";
import Invoice from './Invoice';

export enum ORDER_STATUS {
    OPEN,
    CLOSE
}

export default class Order{
    private items: Item[] = []
    private payment?: Invoice 
    private status: ORDER_STATUS = ORDER_STATUS.OPEN
    
    private constructor(private code: string, private description: string){}

    public static restore(code:string, description:string):Order{
        return new Order(code, description)
    }

    public static create(description?:string):Order{
        let code = randomUUID()
        if(!description) description = code
        return this.restore(code, description)
    }
    
    getCode(): string{
        return this.code
    }

    getStatus():ORDER_STATUS{
        return this.status
    }

    setInvoice(payment: Invoice):void{
        if(this.status !== ORDER_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        this.payment = payment
        this.status = ORDER_STATUS.CLOSE
    }

    getInvoice():Invoice | undefined {
        return this.payment
    }

    getDescription():string {
        return this.description
    }

    getTotal():number {
        let total = 0
        for(const item of this.items){
            total += item.getTotal()
        }
        return total
    }

    getItems():Item[] {
        return this.items
    }

    addItem(productCode: string, price: number, quantity: number = 1): void{
        if(this.status !== ORDER_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        const sequence = this.items.filter((item)=>item.getProductCode() === productCode).length + 1
        let item = Item.create(this.getCode(), productCode, sequence, quantity, price)
        this.items.push(item)
    }

    increaseAmount(productCode: string, sequence:number = 1, step:number = 1):void {
        if(this.status !== ORDER_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        const item = this.items.find((item)=>item.getProductCode() === productCode && item.getSequence() === sequence)
        if(!item) throw new Error("O produto não esta na comanda!")
        if(item) item.quantityUp(step)
    }

    decreaseAmount(productCode: string, sequence:number = 1, step:number = 1):void {
        if(this.status !== ORDER_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        const itemOrder = this.items.find((item)=>item.getProductCode() === productCode && item.getSequence() === sequence)
        if(!itemOrder) throw new Error("O produto não esta na comanda!")
        itemOrder.quantityDown(step)
        if(itemOrder.getQuantity() === 0)
            this.items = this.items.filter((item) => item !== itemOrder)
    }

    getItemsByProductCode(productCode: string): Item[]{
        return this.items.filter((item)=>item.getProductCode() === productCode)
    }
}
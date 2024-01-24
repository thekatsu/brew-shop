import { randomUUID } from 'crypto'
import Item from "./Item";
import Payment from './Payment';

export enum GUESTCHECKPAD_STATUS {
    OPEN,
    CLOSE
}

export default class GuestCheckPad{
    private items: Item[] = []
    private payment?: Payment 
    private status: GUESTCHECKPAD_STATUS = GUESTCHECKPAD_STATUS.OPEN
    
    private constructor(private code: string, private description: string){}

    public static restore(code:string, description:string):GuestCheckPad{
        return new GuestCheckPad(code, description)
    }

    public static create(description?:string):GuestCheckPad{
        let code = randomUUID()
        if(!description) description = code
        return this.restore(code, description)
    }
    
    getCode(): string{
        return this.code
    }

    getStatus():GUESTCHECKPAD_STATUS{
        return this.status
    }

    setPayment(payment: Payment):void{
        if(this.status !== GUESTCHECKPAD_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        this.payment = payment
        this.status = GUESTCHECKPAD_STATUS.CLOSE
    }

    getPayment():Payment | undefined {
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
        if(this.status !== GUESTCHECKPAD_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        const sequence = this.items.filter((item)=>item.getProductCode() === productCode).length + 1
        let item = Item.create(this.getCode(), productCode, sequence, quantity, price)
        this.items.push(item)
    }

    increaseAmount(productCode: string, sequence:number = 1, step:number = 1):void {
        if(this.status !== GUESTCHECKPAD_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        const item = this.items.find((item)=>item.getProductCode() === productCode && item.getSequence() === sequence)
        if(!item) throw new Error("O produto não esta na comanda!")
        if(item) item.quantityUp(step)
    }

    decreaseAmount(productCode: string, sequence:number = 1, step:number = 1):void {
        if(this.status !== GUESTCHECKPAD_STATUS.OPEN) throw new Error("Comanda já esta encerada!")
        const itemInGuestCheckPad = this.items.find((item)=>item.getProductCode() === productCode && item.getSequence() === sequence)
        if(!itemInGuestCheckPad) throw new Error("O produto não esta na comanda!")
        itemInGuestCheckPad.quantityDown(step)
        if(itemInGuestCheckPad.getQuantity() === 0)
            this.items = this.items.filter((item) => item !== itemInGuestCheckPad)
    }

    getItemsByProductCode(productCode: string): Item[]{
        return this.items.filter((item)=>item.getProductCode() === productCode)
    }
}
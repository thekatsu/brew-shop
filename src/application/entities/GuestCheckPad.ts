import { randomUUID } from 'crypto'
import Item from "./Item";

export enum STATUS {
    OPEN,
    CLOSE,
    PAID,
    CANCELED
}

export default class GuestCheckPad{
    private items: Item[] = []
    private status: STATUS
    
    private constructor(private code: string, private description: string){
        this.status = STATUS.OPEN
    }

    public static create({code, description}:{code?:string, description:string}):GuestCheckPad{
        if(!code) code = randomUUID()
        return new GuestCheckPad(code, description)
    }
    
    getCode(): string{
        return this.code
    }

    getDescription():string {
        return this.description
    }

    getStatus(){
        return this.status
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

    addItem(product_code: string, description: string, price: number, amount: number = 1): void{
        let item = new Item(product_code, description, amount, price)
        this.items.push(item)
    }

    increaseAmount(product_code: string, step:number = 1):void {
        const item = this.items.find((item)=>item.getProductCode() === product_code)
        if(!item) throw new Error("O produto não esta na comanda!")
        if(item) item.amountUp(step)
    }

    decreaseAmount(product_code: string, step:number = 1):void {
        const item = this.items.find((item)=>item.getProductCode() === product_code)
        if(!item) throw new Error("O produto não esta na comanda!")
        if(item) item.amountDown(step)
    }

    reopen(){
        if(this.status !== STATUS.CANCELED){
            this.status = STATUS.OPEN
        }
    }

    close(){
        if(this.status === STATUS.OPEN){
            this.status = STATUS.CLOSE
        }
    }

    pay(){
        if(this.status === STATUS.CLOSE){
            this.status = STATUS.PAID
        }
    }

    cancel(){
        if(this.status !== STATUS.PAID){
            this.status = STATUS.CANCELED
        }
    }
}
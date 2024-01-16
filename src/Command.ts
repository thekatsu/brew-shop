import Item from "./Item";

export default class Command{
    private items: Item[] = []
    
    constructor(
        private code: string, private description: string
    ){}
    
    getCode(): string{
        return this.code
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

    addItem(code: string, description: string, price: number): void{
        this.items.push(new Item(code, description, 0, price))
    }

    increaseAmount(item_code: string):void {
        const item = this.items.find((item)=>item.getCode() === item_code)
        if(item) item.amountUp()
    }

    decreaseAmount(item_code: string):void {
        const item = this.items.find((item)=>item.getCode() === item_code)
        if(item) item.amountDown()
    }
}
export default class Item{
    private constructor(
        private guestCheckPadCode: string,
        private productCode: string, 
        private sequence: number,
        private quantity: number, 
        private price: number
    ){}

    public static create(guestCheckPadCode:string, productCode:string, sequence:number, quantity:number, price:number){
        return this.restore(guestCheckPadCode, productCode, sequence, quantity, price)
    }

    public static restore(guestCheckPadCode:string, productCode:string, sequence:number, quantity:number, price:number){
        return new Item(guestCheckPadCode, productCode, sequence, quantity, price)
    }

    /*
    getGuestCheckPadCode(){
        return this.guestCheckPadCode
    }
    */

    getProductCode():string {
        return this.productCode
    }

    getSequence():number {
        return this.sequence
    }

    getQuantity():number {
        return this.quantity
    }

    getPrice():number {
        return this.price
    }

    getTotal(){
        return this.price * this.quantity
    }

    quantityUp(step: number = 1){
        this.quantity += step;
    }

    quantityDown(step: number = 1){
        this.quantity -= step;
    }
}
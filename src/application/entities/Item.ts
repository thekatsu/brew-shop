export default class Item{
    constructor(
        private product_code: string, 
        private description: string, 
        private quantity: number, 
        private price: number
    ){}

    getProductCode():string {
        return this.product_code
    }

    getDescription():string {
        return this.description
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

    amountUp(step: number = 1){
        this.quantity += step;
    }

    amountDown(step: number = 1){
        this.quantity -= step;
    }
}
export default class Item{
    private constructor(
        private orderCode: string,
        private productCode: string, 
        private sequence: number,
        private quantity: number, 
        private price: number
    ){}

    public static create(orderCode:string, productCode:string, sequence:number, quantity:number, price:number){
        return this.restore(orderCode, productCode, sequence, quantity, price)
    }

    public static restore(orderCode:string, productCode:string, sequence:number, quantity:number, price:number){
        return new Item(orderCode, productCode, sequence, quantity, price)
    }

    getOrderCode(){
        return this.orderCode
    }
    
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
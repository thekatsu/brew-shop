export default class Item{
    private productId:string
    private quantity:number
    private value:number

    private constructor(productId:string, quantity:number, value:number){
        this.productId = productId
        this.quantity = quantity
        this.value = value
    }

    public static create(productId:string, quantity:number, value:number){
        return new Item(productId, quantity, value)
    }

    public static restore(productId:string, quantity:number, value:number){
        return new Item(productId, quantity, value)
    }

    getProductId():string {
        return this.productId
    }

    getQuantity():number {
        return this.quantity
    }

    getValue():number {
        return this.value
    }

    getTotal(){
        return this.value * this.quantity
    }

    quantityUp(step: number = 1){
        this.quantity += step;
    }

    quantityDown(step: number = 1){
        this.quantity -= step;
        if(this.quantity <= 0) this.quantity = 0 
    }
}
export default class Item{
    constructor(
        private code: string, 
        private description: string, 
        private amount: number, 
        private price: number
    ){}

    getCode():string {
        return this.code
    }

    getDescription():string {
        return this.description
    }

    getAmount():number {
        return this.amount
    }

    getPrice():number {
        return this.price
    }

    getTotal(){
        return this.price * this.amount
    }

    amountUp(step: number = 1){
        this.amount += step;
    }

    amountDown(step: number = 1){
        this.amount -= step;
    }
}
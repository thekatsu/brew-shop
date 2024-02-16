import { randomUUID } from 'crypto'

export default class Product{
    private constructor(
        private code:string,
        private description: string,
        private price: number
    ){}

    public static create(description: string, price:number){
        let code = randomUUID()
        return this.restore(code, description, price)
    }

    public static restore(code:string, description: string, price:number){
        return new Product(code, description, price)
    }

    getId():string{
        return this.code
    }

    getDescription():string{
        return this.description
    }

    getPrice():number{
        return this.price
    }

    setDescription(value:string){
        this.description = value
    }

    setPrice(value:number){
        this.price = value
    }
}
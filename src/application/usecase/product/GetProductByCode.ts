import IProductRepository from "../../interfaces/IProductRepository";

export default class GetProductByCode{
    constructor(private productRepository: IProductRepository){}

    execute({code}:Input):Output{
        let products = this.productRepository.getAll()
        let product = products.find((product)=>product.getCode() === code)
        if(!product) throw new Error("Produto não encontrado")
        return {
            code: product.getCode(),
            description: product.getDescription(),
            price: product.getPrice()
        }
    }
}

export type Input = {
    code: string
}

export type Output = {
    code:string
    description: string
    price: number
}
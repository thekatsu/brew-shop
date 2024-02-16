import IProductRepository from "../../domain/interfaces/IProductRepository"

export default class GetProductByCode{
    constructor(private productRepository: IProductRepository){}

    execute({code}:Input):Output{
        let products = this.productRepository.getAll()
        let product = products.find((product)=>product.getId() === code)
        if(!product) throw new Error("Produto não encontrado")
        return {
            code: product.getId(),
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
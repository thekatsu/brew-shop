import Product from "../../domain/entities/Product"
import IProductRepository from "../../domain/interfaces/IProductRepository"

export default class CreateProduct{
    constructor(private productRepository: IProductRepository){}

    execute({description, price}: Input){
        this.productRepository.save(Product.create(description, price))
    }
}

export type Input = {
    description: string
    price: number
}
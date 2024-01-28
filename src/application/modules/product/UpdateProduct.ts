import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class UpdateProduct{
    constructor(private productRepository: IProductRepository){}

    execute({code, description, price}:Input){
        const product = this.productRepository.getByCode(code)
        if(!product) throw new Error("Produto não encontrado")
        product.setDescription(description)
        product.setPrice(price)
        this.productRepository.save(product)
    }
}

export type Input = {
    code:string
    description:string
    price: number
}
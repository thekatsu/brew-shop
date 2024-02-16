import IProductRepository from "../../domain/interfaces/IProductRepository"

export default class GetAllProducts{
    constructor(private productRepository: IProductRepository){}

    execute():Output[]{
        const productsRepo = this.productRepository.getAll()
        return productsRepo.map((value) => {
            return {
                code: value.getId(),
                description: value.getDescription(),
                price: value.getPrice()
            }
        })
    }
}

export type Output = {
    code:string
    description: string
    price: number
}

import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class GetAllProducts{
    constructor(private productRepository: IProductRepository){}

    execute():Output[]{
        const productsRepo = this.productRepository.getAll()
        return productsRepo.map((value) => {
            return {
                code: value.getCode(),
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

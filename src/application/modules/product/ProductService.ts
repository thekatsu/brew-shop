import Product from "../../entities/Product";
import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class ProductService{
    constructor(private productRepository: IProductRepository){}

    create(input: InputCreate){
        this.productRepository.save(Product.create(input.description, input.price))
    }

    update(input:InputUpdate){
        const product = this.productRepository.getByCode(input.productCode)
        if(!product) throw new Error("Produto não encontrado")
        product.setDescription(input.description)
        product.setPrice(input.price)
        this.productRepository.save(product)
    }

    getAll():OutputGetAll[]{
        const productsRepo = this.productRepository.getAll()
        const products:OutputGetAll[] = []
        return productsRepo.map((value) => {
            return {
                code: value.getCode(),
                description: value.getDescription(),
                price: value.getPrice()
            }
        })
    
    }

    getByCode(code:string):OutputGetByCode{
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

export type InputCreate = {
    description: string
    price: number
}

export type InputUpdate = {
    productCode:string
    description:string
    price: number
}

export type OutputGetAll = {
    code:string
    description: string
    price: number
}

export type OutputGetByCode = {
    code:string
    description: string
    price: number
}
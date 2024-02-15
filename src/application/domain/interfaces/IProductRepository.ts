import Product from "../../domain/entities/Product"

export default interface IProductRepository{
    save(product:Product):void
    getAll():Product[]
    getById(code:string):Product
}
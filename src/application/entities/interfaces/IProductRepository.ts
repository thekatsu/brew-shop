import Product from "../Product";

export default interface IProductRepository{
    save(product:Product):void
    getAll():Product[]
    getByCode(code:string):Product
}
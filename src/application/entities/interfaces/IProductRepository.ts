import Product from "../Product";

export default interface IProductRepository{
    getAll():Product[]
    getByCode(code:string):Product
}
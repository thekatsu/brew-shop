import Product from "../../application/entities/Product";
import IProductRepository from "../../application/entities/interfaces/IProductRepository";

export default class ProductRepositoryInMemory implements IProductRepository{
    private products: Product[] = [
        {code: "e852f5a4-c688-4383-8663-1d4cda236075", description: "A", price: 12},
        {code: "c0f546c6-5107-4f1d-b8af-213fb8b0ff81", description: "B", price: 4},
        {code: "30766e56-f967-4ab8-b7a5-3bad278d6c5a", description: "C", price: 12},
        {code: "634bfc31-2806-4069-9b5b-1c6ade267f70", description: "D", price: 10},
        {code: "c94f9685-5845-47ea-979d-3b0d7bbcad92", description: "E", price: 8}
    ]

    getAll(): Product[] {
        return this.products
    }

    getByCode(code: string): Product {
        const product = this.products.find((product)=>product.code === code)
        if(!product) throw new Error("Produto não localizado!")
        return product
    }
}
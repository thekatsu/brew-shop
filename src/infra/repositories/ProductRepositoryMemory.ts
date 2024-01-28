import Product from "../../application/entities/Product";
import IProductRepository from "../../application/entities/interfaces/IProductRepository";

export default class ProductRepositoryMemory implements IProductRepository{
    private products: Product[] = [
        Product.restore("e852f5a4-c688-4383-8663-1d4cda236075", "A", 12),
        Product.restore("c0f546c6-5107-4f1d-b8af-213fb8b0ff81", "B", 4),
        Product.restore("30766e56-f967-4ab8-b7a5-3bad278d6c5a", "C", 12),
        Product.restore("634bfc31-2806-4069-9b5b-1c6ade267f70", "D", 72),
        Product.restore("c94f9685-5845-47ea-979d-3b0d7bbcad92", "E", 8)
    ]
    
    save(product:Product): void {
        if(this.products.indexOf(product) !== -1){
            this.products[this.products.indexOf(product)] = product
        } else {
            this.products.push(product)
        }
    }

    getAll(): Product[] {
        return this.products
    }

    getByCode(code: string): Product {
        const product = this.products.find((product)=>product.getCode() === code)
        if(!product) throw new Error("Produto não encontrado!")
        return product
    }
}
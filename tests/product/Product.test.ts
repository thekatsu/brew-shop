import IProductRepository from "../../src/application/entities/interfaces/IProductRepository"
import ProductService from "../../src/application/modules/product/ProductService"
import ProductRepositoryInMemory from "../../src/infra/repositories/ProductRepositoryInMemory"

describe("testes relacionado ao produto", ()=>{
    let productRepo: IProductRepository
    let productService: ProductService

    beforeEach(()=>{
        productRepo = new ProductRepositoryInMemory()
        productService = new ProductService(productRepo)
    })

    it("deve permitir cadastrar produto", ()=>{
        const inputCreate = {
            description: "meu produto",
            price: 24
        }
        productService.create(inputCreate)
        expect(productRepo.getAll()[5].getCode()).toBeDefined()
        expect(productRepo.getAll()[5].getDescription()).toBe(inputCreate.description)
        expect(productRepo.getAll()[5].getPrice()).toBe(inputCreate.price)
    })

    it("deve permitir alterar um produto", ()=>{
        const inputCreate = {
            description: "meu produto",
            price: 24
        }
        productService.create(inputCreate)
        expect(productRepo.getAll()[5].getCode()).toBeDefined()
        expect(productRepo.getAll()[5].getDescription()).toBe(inputCreate.description)
        expect(productRepo.getAll()[5].getPrice()).toBe(inputCreate.price)
        productService.update({productCode: productRepo.getAll()[5].getCode(), ...inputCreate, description:"Meu produto alterado"})
        expect(productRepo.getAll()[5].getDescription()).toBe("Meu produto alterado")
    })

    it("deve permitir buscar todos produtos", ()=>{
        expect(productService.getAll().length).toBe(5)
    })

    it("deve permitir obter produto pelo codigo", ()=>{
        let product = productService.getByCode("634bfc31-2806-4069-9b5b-1c6ade267f70")
        expect(product.code).toBe("634bfc31-2806-4069-9b5b-1c6ade267f70")
    })
})
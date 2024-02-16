import IProductRepository from "../../src/application/domain/interfaces/IProductRepository"
import ProductRepositoryInMemory from "../../src/application/infra/repositories/ProductRepositoryMemory"
import CreateProduct from "../../src/application/usecase/product/CreateProduct"
import GetAllProducts from "../../src/application/usecase/product/GetAllProducts"
import GetProductByCode from "../../src/application/usecase/product/GetProductByCode"
import UpdateProduct from "../../src/application/usecase/product/UpdateProduct"

describe("testes relacionado ao produto", ()=>{
    let productRepo: IProductRepository
    let createProduct: CreateProduct
    let getAllProduct: GetAllProducts
    let getProductByCode: GetProductByCode
    let updateProduct: UpdateProduct

    beforeEach(()=>{
        productRepo = new ProductRepositoryInMemory()
        createProduct = new CreateProduct(productRepo)
        getAllProduct = new GetAllProducts(productRepo)
        getProductByCode = new GetProductByCode(productRepo)
        updateProduct = new UpdateProduct(productRepo)
    })

    it("deve permitir cadastrar produto", ()=>{
        const inputCreate = {
            description: "meu produto",
            price: 24
        }
        createProduct.execute(inputCreate)
        expect(productRepo.getAll()[5].getId()).toBeDefined()
        expect(productRepo.getAll()[5].getDescription()).toBe(inputCreate.description)
        expect(productRepo.getAll()[5].getPrice()).toBe(inputCreate.price)
    })

    it("deve permitir alterar um produto", ()=>{
        const inputCreate = {
            description: "meu produto",
            price: 24
        }
        createProduct.execute(inputCreate)
        expect(productRepo.getAll()[5].getId()).toBeDefined()
        expect(productRepo.getAll()[5].getDescription()).toBe(inputCreate.description)
        expect(productRepo.getAll()[5].getPrice()).toBe(inputCreate.price)
        updateProduct.execute({code: productRepo.getAll()[5].getId(), ...inputCreate, description:"Meu produto alterado"})
        expect(productRepo.getAll()[5].getDescription()).toBe("Meu produto alterado")
    })

    it("deve permitir buscar todos produtos", ()=>{
        expect(getAllProduct.execute().length).toBe(5)
    })

    it("deve permitir obter produto pelo codigo", ()=>{
        let product = getProductByCode.execute({code: "634bfc31-2806-4069-9b5b-1c6ade267f70"})
        expect(product.code).toBe("634bfc31-2806-4069-9b5b-1c6ade267f70")
    })
})
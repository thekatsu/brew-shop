import { ORDER_STATUS } from "../../src/application/entities/Order"
import IOrderRepository from "../../src/application/entities/interfaces/IOrderRepository"
import IProductRepository from "../../src/application/entities/interfaces/IProductRepository"
import Create from "../../src/application/modules/order/CreateOrder"
import DecreaseQuantityProduct from "../../src/application/modules/order/DecreaseQuantityProduct"
import GetOrderByCode from "../../src/application/modules/order/GetOrderByCode"
import GetItemsByProductCode from "../../src/application/modules/order/GetItemsByProductCode"
import IncreaseQuantityProduct from "../../src/application/modules/order/IncreaseQuantityProduct"
import OrderRepositoryMemory from "../../src/infra/repositories/OrderRepositoryMemory"
import ProductRepositoryInMemory from "../../src/infra/repositories/ProductRepositoryMemory"

describe("Testes do Order", ()=>{
    let orderRepo: IOrderRepository
    let productRepo: IProductRepository
    
    beforeEach(()=>{
        orderRepo = new OrderRepositoryMemory()
        productRepo = new ProductRepositoryInMemory()
    })

    it("deve criar uma comanda", ()=>{
        const input = {
            description: "Minha primeira comanda"
        }
        new Create(orderRepo, productRepo).execute(input)
        const order = orderRepo.getAll()[0]
        expect(order.getDescription()).toBe(input.description)
        expect(order.getStatus()).toBe(ORDER_STATUS.OPEN)
    })

    it("deve obter uma comanda pelo codigo", ()=>{
        const input = {
            description: "Minha primeira comanda"
        }
        new Create(orderRepo, productRepo).execute(input)
        const orderCode = orderRepo.getAll()[0].getCode()
        let inputProduct = {
            orderCode: orderCode,
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        new IncreaseQuantityProduct(orderRepo, productRepo).execute(inputProduct)

        expect(new GetOrderByCode(orderRepo, productRepo).execute({orderCode}).code).toBe(orderCode)
    })

    it("cria uma comanda sem descrição", ()=>{
        new Create(orderRepo, productRepo).execute()
        expect(orderRepo.getAll()[0].getDescription()).toBe(orderRepo.getAll()[0].getCode())
    })

    it("retorna erro ao tentar inserir um produto existente a uma comanda inexistente", ()=>{
        let input = {
            orderCode: 'a',
            productCode: '30766e56-f967-4ab8-b7a5-3bad278d6c5a'
        }
        expect(() => new IncreaseQuantityProduct(orderRepo, productRepo).execute(input)).toThrow("Comanda não encontrada!")
    })

    it("retorna erro ao tentar inserir um produto inexistente a uma comanda existente", ()=>{
        new Create(orderRepo, productRepo).execute()
        let input = {
            orderCode: orderRepo.getAll()[0].getCode(),
            productCode: '30766e56'
        }
        expect(() => new IncreaseQuantityProduct(orderRepo, productRepo).execute(input)).toThrow("Produto não encontrado!")
    })

    it("insere um produto em uma comanda", ()=>{
        new Create(orderRepo, productRepo).execute()
        const order = orderRepo.getAll()[0]
        let input = {
            orderCode: order.getCode(),
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        new IncreaseQuantityProduct(orderRepo, productRepo).execute(input)
        const items = new GetItemsByProductCode(orderRepo, productRepo).execute({orderCode: order.getCode(), productCode: input.productCode})
        expect(items[0].productCode).toBe(input.productCode)
        expect(order.getTotal()).toBe(72)
    })

    it("insere 10 unidades de um produto em uma comanda", ()=>{
        new Create(orderRepo, productRepo).execute()
        const order = orderRepo.getAll()[0]
        let input = {
            orderCode: order.getCode(),
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70',
            quantity: 10
        }
        new IncreaseQuantityProduct(orderRepo, productRepo).execute(input)
        const items = new GetItemsByProductCode(orderRepo, productRepo).execute({orderCode: order.getCode(), productCode: input.productCode})
        expect(items[0].quantity).toBe(10)
        expect(items[0].price).toBe(72)
        expect(items[0].description).toBe("D")
        expect(items[0].total).toBe(720)
        expect(order.getTotal()).toBe(720)
    })

    it("remove um produto de uma comanda", ()=>{
        new Create(orderRepo, productRepo).execute()
        const orderCode = orderRepo.getAll()[0].getCode()
        let input = {
            orderCode,
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        new IncreaseQuantityProduct(orderRepo, productRepo).execute(input)
        new DecreaseQuantityProduct(orderRepo, productRepo).execute(input)
        const items = new GetItemsByProductCode(orderRepo, productRepo).execute({orderCode, productCode: input.productCode})
        expect(items).toStrictEqual([])
    })

    it("remove 5 um produto que haviam 10 unidades de uma comanda", ()=>{
        new Create(orderRepo, productRepo).execute()
        const orderCode = orderRepo.getAll()[0].getCode()
        let input = {
            orderCode,
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70',
            quantity: 10
        }
        new IncreaseQuantityProduct(orderRepo, productRepo).execute(input)
        new DecreaseQuantityProduct(orderRepo, productRepo).execute({...input, quantity: 5})
        const items = new GetItemsByProductCode(orderRepo, productRepo).execute({orderCode, productCode: input.productCode})
        expect(items[0].quantity).toBe(5)
    })
})
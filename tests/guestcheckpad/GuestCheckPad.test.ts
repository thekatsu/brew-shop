import { GUESTCHECKPAD_STATUS } from "../../src/application/entities/GuestCheckPad"
import IGuestCheckPadRepository from "../../src/application/entities/interfaces/IGuestCheckPadRepository"
import IProductRepository from "../../src/application/entities/interfaces/IProductRepository"
import GuestCheckPadService from "../../src/application/modules/guestcheckpad/GuestCheckPadService"
import GuestCheckPadRepositoryInMemory from "../../src/infra/repositories/GuestCheckPadRepositoryInMemory"
import ProductRepositoryInMemory from "../../src/infra/repositories/ProductRepositoryInMemory"

describe("Testes do GuestCheckPad", ()=>{
    let guestCheckPadRepo: IGuestCheckPadRepository
    let productRepo: IProductRepository
    let guestCheckPadService: GuestCheckPadService

    beforeEach(()=>{
        guestCheckPadRepo = new GuestCheckPadRepositoryInMemory()
        productRepo = new ProductRepositoryInMemory()
        guestCheckPadService = new GuestCheckPadService(guestCheckPadRepo, productRepo)
    })

    it("deve criar uma comanda", ()=>{
        const input = {
            description: "Minha primeira comanda"
        }
        guestCheckPadService.create(input)
        const guestCheckPad = guestCheckPadRepo.getAll()[0]
        expect(guestCheckPad.getDescription()).toBe(input.description)
        expect(guestCheckPad.getStatus()).toBe(GUESTCHECKPAD_STATUS.OPEN)
    })

    it("deve obter uma comanda pelo codigo", ()=>{
        const input = {
            description: "Minha primeira comanda"
        }
        guestCheckPadService.create(input)
        const guestCheckPadCode = guestCheckPadRepo.getAll()[0].getCode()
        let inputProduct = {
            guestCheckPadCode: guestCheckPadCode,
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        guestCheckPadService.addProduct(inputProduct)
        expect(guestCheckPadService.getByCode({guestCheckPadCode}).code).toBe(guestCheckPadCode)
    })

    it("cria uma comanda sem descrição", ()=>{
        guestCheckPadService.create()
        expect(guestCheckPadRepo.getAll()[0].getDescription()).toBe(guestCheckPadRepo.getAll()[0].getCode())
    })

    it("retorna erro ao tentar inserir um produto existente a uma comanda inexistente", ()=>{
        let input = {
            guestCheckPadCode: 'a',
            productCode: '30766e56-f967-4ab8-b7a5-3bad278d6c5a'
        }
        expect(() => guestCheckPadService.addProduct(input)).toThrow("Comanda não encontrada!")
    })

    it("retorna erro ao tentar inserir um produto inexistente a uma comanda existente", ()=>{
        guestCheckPadService.create()
        let input = {
            guestCheckPadCode: guestCheckPadRepo.getAll()[0].getCode(),
            productCode: '30766e56'
        }
        expect(() => guestCheckPadService.addProduct(input)).toThrow("Produto não encontrado!")
    })

    it("insere um produto em uma comanda", ()=>{
        guestCheckPadService.create()
        const guestCheckPad = guestCheckPadRepo.getAll()[0]
        let input = {
            guestCheckPadCode: guestCheckPad.getCode(),
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        guestCheckPadService.addProduct(input)
        const items = guestCheckPadService.getItemsByProductCode({guestCheckPadCode: guestCheckPad.getCode(), productCode: input.productCode})
        expect(items[0].productCode).toBe(input.productCode)
        expect(guestCheckPad.getTotal()).toBe(72)
    })

    it("insere 10 unidades de um produto em uma comanda", ()=>{
        guestCheckPadService.create()
        const guestCheckPad = guestCheckPadRepo.getAll()[0]
        let input = {
            guestCheckPadCode: guestCheckPad.getCode(),
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        guestCheckPadService.addProduct(input, 10)
        const items = guestCheckPadService.getItemsByProductCode({guestCheckPadCode: guestCheckPad.getCode(), productCode: input.productCode})
        expect(items[0].quantity).toBe(10)
        expect(items[0].price).toBe(72)
        expect(items[0].description).toBe("D")
        expect(items[0].total).toBe(720)
        expect(guestCheckPad.getTotal()).toBe(720)
    })

    it("remove um produto de uma comanda", ()=>{
        guestCheckPadService.create()
        const guestCheckPadCode = guestCheckPadRepo.getAll()[0].getCode()
        let input = {
            guestCheckPadCode,
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        guestCheckPadService.addProduct(input)
        guestCheckPadService.removeProduct(input)
        const items = guestCheckPadService.getItemsByProductCode({guestCheckPadCode, productCode: input.productCode})
        expect(items).toStrictEqual([])
    })

    it("remove 5 um produto que haviam 10 unidades de uma comanda", ()=>{
        guestCheckPadService.create()
        const guestCheckPadCode = guestCheckPadRepo.getAll()[0].getCode()
        let input = {
            guestCheckPadCode,
            productCode: '634bfc31-2806-4069-9b5b-1c6ade267f70'
        }
        guestCheckPadService.addProduct(input, 10)
        guestCheckPadService.removeProduct(input, 5)
        const items = guestCheckPadService.getItemsByProductCode({guestCheckPadCode, productCode: input.productCode})
        expect(items[0].quantity).toBe(5)
    })
})
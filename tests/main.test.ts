import GuestCheckPadRepositoryInMemory from "../src/infra/repositories/GuestCheckPadRepositoryInMemory"
import ProductRepositoryInMemory from '../src/infra/repositories/ProductRepositoryInMemory'
import PaymentRepositoryInMemory from '../src/infra/repositories/PaymentRepositoryInMemory'
import CreateGuestCheckPad from "../src/application/modules/guestcheckpad/CreateGuestCheckPad"
import {STATUS} from "../src/application/entities/GuestCheckPad"
import AddProductInGuestCheckPad from "../src/application/modules/guestcheckpad/AddProductInGuestCheckPad"
import StartPaymentGuestCheckPad from "../src/application/modules/guestcheckpad/StartPaymentGuestCheckPad"

describe("teste de integração", ()=>{
    test("Deve criar uma comanda", ()=>{
        const repo = new GuestCheckPadRepositoryInMemory()
        const input = {
            description: "João"
        }
        new CreateGuestCheckPad(repo).execute(input)
        expect(repo.getAll()[0].getCode()).toBeDefined()
        expect(repo.getAll()[0].getDescription()).toBe(input.description)
        expect(repo.getAll()[0].getItems()).toStrictEqual([])
        expect(repo.getAll()[0].getTotal()).toBe(0)
        expect(repo.getAll()[0].getTotal()).toBe(STATUS.OPEN)
    })

    test("Deve incrementar um item a uma comanda", ()=>{
        const guestCheckPadRepo = new GuestCheckPadRepositoryInMemory()
        const productRepo = new ProductRepositoryInMemory()
        const createGuestCheckPad = new CreateGuestCheckPad(guestCheckPadRepo)
        const addProductInGuestCheckPad = new AddProductInGuestCheckPad(guestCheckPadRepo, productRepo)
        const createInput = {
            description: "João"
        }
        createGuestCheckPad.execute(createInput)
        
        const addInput = {
            guestcheckpad_code: guestCheckPadRepo.getAll()[0].getCode(),
            product_code: "e852f5a4-c688-4383-8663-1d4cda236075"
        }
        addProductInGuestCheckPad.execute(addInput)
        let guestCheckPadInRepo = guestCheckPadRepo.getByCode(addInput.guestcheckpad_code)
        expect(guestCheckPadInRepo.getItems()[0].getProductCode()).toBe("e852f5a4-c688-4383-8663-1d4cda236075")
        expect(guestCheckPadInRepo.getItems()[0].getPrice()).toBe(12)
        expect(guestCheckPadInRepo.getItems()[0].getDescription()).toBe("A")
        expect(guestCheckPadInRepo.getItems()[0].getTotal()).toBe(12)
        expect(guestCheckPadInRepo.getTotal()).toBe(12)
        const input3 = {
            guestcheckpad_code: addInput.guestcheckpad_code,
            product_code: "e852f5a4-c688-4383-8663-1d4cda236075"
        }
        addProductInGuestCheckPad.execute(input3)
        guestCheckPadInRepo = guestCheckPadRepo.getByCode(addInput.guestcheckpad_code)
        expect(guestCheckPadInRepo.getItems()[0].getTotal()).toBe(24)
        expect(guestCheckPadInRepo.getTotal()).toBe(24)
    })

    test.only("Deve iniciar um pagamento para uma comanda e fecha-la", ()=>{
        const repo = new GuestCheckPadRepositoryInMemory()
        const paymentRepo = new PaymentRepositoryInMemory()
        const productRepo = new ProductRepositoryInMemory()
        const createGuestCheckPad = new CreateGuestCheckPad(repo)
        const addProduct = new AddProductInGuestCheckPad(repo, productRepo)
        const payment = new StartPaymentGuestCheckPad(paymentRepo, repo)
        const guestCheckPad = []
        for(let i=0; i < 3; i++){
            const inputCreate = {
                description: `João ${i}`
            }
            createGuestCheckPad.execute(inputCreate)
            const inputAddProduct = {
                guestcheckpad_code: repo.getAll()[i].getCode(),
                product_code: productRepo.getAll()[i].code
            }
            addProduct.execute(inputAddProduct)
            guestCheckPad.push({
                guestcheckpad: repo.getAll()[i],
                product: productRepo.getAll()[i]
            })
        }
        const inputPayment = {
            guestcheckpad_codes: guestCheckPad.map((value)=>value.guestcheckpad.getCode()),
            number_of_installments: 1
        }
        payment.execute(inputPayment)
        expect(paymentRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(28)
        expect(paymentRepo.getAll()[0].getGuestCheckPads().length).toBe(3)
        expect(paymentRepo.getAll()[0].getInstallments().length).toBe(1)
    })
})

import IGuestCheckPadRepository from "../../src/application/entities/interfaces/IGuestCheckPadRepository"
import IProductRepository from "../../src/application/entities/interfaces/IProductRepository"
import IPaymentGuestCheckPadRepository from "../../src/application/entities/interfaces/IPaymentGuestCheckPadRepository"
import GuestCheckPadService from "../../src/application/modules/guestcheckpad/GuestCheckPadService"
import PaymentGuestCheckPadService from "../../src/application/modules/guestcheckpad/PaymentGuestCheckPadService"
import GuestCheckPadRepositoryInMemory from "../../src/infra/repositories/GuestCheckPadRepositoryInMemory"
import ProductRepositoryInMemory from "../../src/infra/repositories/ProductRepositoryInMemory"
import PaymentRepositoryInMemory from "../../src/infra/repositories/PaymentRepositoryInMemory"
import { PAYMENT_STATUS } from "../../src/application/entities/Payment"
import { GUESTCHECKPAD_STATUS } from "../../src/application/entities/GuestCheckPad"
import Installment, { INSTALLMENT_STATUS } from "../../src/application/entities/Installment"

describe("Teste de pagamentos de comanda", ()=>{
    let guestCheckPadRepo: IGuestCheckPadRepository
    let productRepo: IProductRepository
    let paymentRepo: IPaymentGuestCheckPadRepository
    let guestCheckPadService: GuestCheckPadService
    let paymentGuestCheckPadService: PaymentGuestCheckPadService

    beforeEach(()=>{
        guestCheckPadRepo = new GuestCheckPadRepositoryInMemory()
        productRepo = new ProductRepositoryInMemory()
        paymentRepo = new PaymentRepositoryInMemory()
        guestCheckPadService = new GuestCheckPadService(guestCheckPadRepo, productRepo)
        paymentGuestCheckPadService = new PaymentGuestCheckPadService(paymentRepo, guestCheckPadRepo)

        for(let i = 0; i < 4; i++){
            let InputCreate = {
                description: `Comanda ${i}`
            }
            guestCheckPadService.create(InputCreate)
            let input = {
                guestCheckPadCode: guestCheckPadRepo.getAll()[i].getCode(),
                productCode: productRepo.getAll()[i].getCode()
            }
            guestCheckPadService.addProduct(input)
        }
    })

    it("deve buscar um pagamento pelo codigo", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode())
        }
        paymentGuestCheckPadService.create(InputCreate)
        const paymentCode = paymentRepo.getAll()[0].getCode()
        expect(paymentGuestCheckPadService.getByCode({paymentCode})).toBeDefined()
    })
    
    it("deve iniciar um pagamento de uma comanda", () => {
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode())
        }
        paymentGuestCheckPadService.create(InputCreate)
        expect(paymentRepo.getAll()[0].getCode()).toBeDefined()
        expect(paymentRepo.getAll()[0].getInstallments().length).toBe(1)
        expect(paymentRepo.getAll()[0].getGuestCheckPads().length).toBe(4)
        expect(paymentRepo.getAll()[0].getStatus()).toBe(PAYMENT_STATUS.OPEN)
        expect(paymentRepo.getAll()[0].getTotalInstallmentsPaid()).toBe(0)
        expect(paymentRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(guestCheckPadRepo.getAll()[0].getStatus()).toBe(GUESTCHECKPAD_STATUS.CLOSE)
        expect(guestCheckPadRepo.getAll()[0].getPayment()).toBeDefined()
    })

    it("deve ocorrer erro ao tentar inciar pagamento de uma comanda que já possui pagamento", () => {
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode())
        }
        paymentGuestCheckPadService.create(InputCreate)
        expect(() => paymentGuestCheckPadService.create(InputCreate)).toThrow("Comanda já esta encerada!")
    })

    it("deve gerar pagamento com três parcelas de 33.33 sendo que a ultima é 33.34", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 3
        }
        paymentGuestCheckPadService.create(InputCreate)
        //console.log(paymentRepo.getAll()[0].getInstallments())
        expect(paymentRepo.getAll()[0].getInstallments().length).toBe(3)
        expect(paymentRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(paymentRepo.getAll()[0].getInstallments()[0].getValue()).toBe(33.33)
        expect(paymentRepo.getAll()[0].getInstallments()[2].getValue()).toBe(33.34)
    })

    it("deve gerar pagamento com seis parcelas de 16.67 sendo que a ultima é 16.65", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        paymentGuestCheckPadService.create(InputCreate)
        expect(paymentRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(paymentRepo.getAll()[0].getInstallments()[0].getValue()).toBe(16.67)
        expect(paymentRepo.getAll()[0].getInstallments()[5].getValue()).toBe(16.65)
    })

    it("deve realizar pagamento de uma das parcelas", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        paymentGuestCheckPadService.create(InputCreate)
        const InputPayInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1
        }
        paymentGuestCheckPadService.payInstallment(InputPayInstallment)
        expect(paymentRepo.getByCode(InputPayInstallment.paymentCode).getTotalInstallmentsPaid()).toBe(16.67)
        expect(paymentRepo.getByCode(InputPayInstallment.paymentCode).getTotalOutstandingInstallments()).toBeCloseTo(100-16.67)
        expect(paymentRepo.getByCode(InputPayInstallment.paymentCode).getInstallments()[0].getStatus()).toBe(INSTALLMENT_STATUS.PAID)
    })

    it("não deve permitir alterar o valor de uma parcela quando a soma das parcelas em aberto exceder o total em aberto", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        paymentGuestCheckPadService.create(InputCreate)
        const AlterInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1,
            value: 18
        }
        expect(() => paymentGuestCheckPadService.alterInstallment(AlterInstallment)).toThrow("O valor excede o total em aberto!")
    })

    it("deve permitir alterar o valor de uma parcela quando a soma das parcelas em aberto for menor que o total em aberto", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        paymentGuestCheckPadService.create(InputCreate)
        const AlterInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1,
            value: 16
        }
        paymentGuestCheckPadService.alterInstallment(AlterInstallment)
        const installments = paymentRepo.getByCode(AlterInstallment.paymentCode).getInstallments()
        expect(installments[0].getValue()).toBe(16)
        expect(paymentRepo.getByCode(AlterInstallment.paymentCode).getTotalOpen()).toBe(100)
        expect(paymentRepo.getByCode(AlterInstallment.paymentCode).getTotalOutstandingInstallments()).toBeCloseTo(100-16.67+16)
    })

    it("deve alterar o status do pagamento para pago quando todas parcelas forem pagas", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        paymentGuestCheckPadService.create(InputCreate)
        const InputPayInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1
        }
        paymentGuestCheckPadService.payInstallment(InputPayInstallment)
        expect(paymentRepo.getAll()[0].getStatus()).toBe(PAYMENT_STATUS.PAID)
    })

    it("deve gerar um erro ao tentar cancelar um pagamento que esta no status pago", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        paymentGuestCheckPadService.create(InputCreate)
        const InputPayInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1
        }
        paymentGuestCheckPadService.payInstallment(InputPayInstallment)
        const InputCancelInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode()
        }
        expect(()=>paymentGuestCheckPadService.cancelPayment(InputCancelInstallment)).toThrow("Pagamento com o status pago não pode ser cancelado!")
    })

    it("deve permitir cancelar um pagamento que esta em aberto", ()=>{
        const InputCreate = {
            guestCheckPadCodes: guestCheckPadRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        paymentGuestCheckPadService.create(InputCreate)
        const InputCancelInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode()
        }
        paymentGuestCheckPadService.cancelPayment(InputCancelInstallment)
        expect(paymentRepo.getAll()[0].getStatus()).toBe(PAYMENT_STATUS.CANCELED)
    })
})
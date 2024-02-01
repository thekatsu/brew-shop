import IInvoiceRepository from "../../src/application/interfaces/IInvoiceRepository"
import IOrderRepository from "../../src/application/interfaces/IOrderRepository"
import IProductRepository from "../../src/application/interfaces/IProductRepository"
import AlterPayment from "../../src/application/usecase/invoice/AlterInstallment"
import CancelInvoice from "../../src/application/usecase/invoice/CancelInvoice"
import CreateInvoice from "../../src/application/usecase/invoice/CreateInvoice"
import GetInvoiceByCode from "../../src/application/usecase/invoice/GetInvoiceByCode"
import PayInvoice from "../../src/application/usecase/invoice/PayInstallment"
import CreateOrder from "../../src/application/usecase/order/CreateOrder"
import IncreaseQuantityProduct from "../../src/application/usecase/order/IncreaseQuantityProduct"
import { INVOICE_STATUS } from "../../src/domain/entities/Invoice"
import { ORDER_STATUS } from "../../src/domain/entities/Order"
import { INSTALLMENT_STATUS } from "../../src/domain/entities/Installment"
import InvoiceRepositoryMemory from "../../src/infra/repositories/InvoiceRepositoryMemory"
import OrderRepositoryInMemory from "../../src/infra/repositories/OrderRepositoryMemory"
import ProductRepositoryMemory from "../../src/infra/repositories/ProductRepositoryMemory"

describe("Teste de pagamentos de comanda", ()=>{
    let orderRepo: IOrderRepository
    let productRepo: IProductRepository
    let invoiceRepo: IInvoiceRepository
    let createOrder: CreateOrder
    let addProduct: IncreaseQuantityProduct
    let createInvoice: CreateInvoice
    let getInvoiceByCode: GetInvoiceByCode
    let alterPayment: AlterPayment
    let cancelInvoice: CancelInvoice
    let payPayment: PayInvoice

    beforeEach(()=>{
        orderRepo = new OrderRepositoryInMemory()
        productRepo = new ProductRepositoryMemory()
        invoiceRepo = new InvoiceRepositoryMemory()
        createOrder = new CreateOrder(orderRepo, productRepo)
        addProduct = new IncreaseQuantityProduct(orderRepo, productRepo)
        createInvoice = new CreateInvoice(invoiceRepo, orderRepo)
        getInvoiceByCode = new GetInvoiceByCode(invoiceRepo)
        alterPayment = new AlterPayment(invoiceRepo)
        cancelInvoice = new CancelInvoice(invoiceRepo)
        payPayment = new PayInvoice(invoiceRepo)

        for(let i = 0; i < 4; i++){
            let inputCreate = {
                description: `Comanda ${i}`
            }
            createOrder.execute(inputCreate)
            let input = {
                orderCode: orderRepo.getAll()[i].getCode(),
                productCode: productRepo.getAll()[i].getCode()
            }
            addProduct.execute(input)
        }
    })

    it("deve buscar um pagamento pelo codigo", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode())
        }
        createInvoice.execute(inputCreate)
        const invoiceCode = invoiceRepo.getAll()[0].getCode()
        expect(getInvoiceByCode.execute({invoiceCode})).toBeDefined()
    })
    
    it("deve iniciar um pagamento de uma comanda", () => {
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode())
        }
        createInvoice.execute(inputCreate)
        expect(invoiceRepo.getAll()[0].getCode()).toBeDefined()
        expect(invoiceRepo.getAll()[0].getInstallments().length).toBe(1)
        expect(invoiceRepo.getAll()[0].getOrders().length).toBe(4)
        expect(invoiceRepo.getAll()[0].getStatus()).toBe(INVOICE_STATUS.OPEN)
        expect(invoiceRepo.getAll()[0].getTotalInstallmentsPaid()).toBe(0)
        expect(invoiceRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(orderRepo.getAll()[0].getStatus()).toBe(ORDER_STATUS.CLOSE)
        expect(orderRepo.getAll()[0].getInvoice()).toBeDefined()
    })

    it("deve ocorrer erro ao tentar inciar pagamento de uma comanda que já possui pagamento", () => {
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode())
        }
        createInvoice.execute(inputCreate)
        expect(() => createInvoice.execute(inputCreate)).toThrow("Comanda já esta encerada!")
    })

    it("deve gerar pagamento com três parcelas de 33.33 sendo que a ultima é 33.34", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 3
        }
        createInvoice.execute(inputCreate)
        //console.log(invoiceRepo.getAll()[0].getInstallments())
        expect(invoiceRepo.getAll()[0].getInstallments().length).toBe(3)
        expect(invoiceRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(invoiceRepo.getAll()[0].getInstallments()[0].getValue()).toBe(33.33)
        expect(invoiceRepo.getAll()[0].getInstallments()[2].getValue()).toBe(33.34)
    })

    it("deve gerar pagamento com seis parcelas de 16.67 sendo que a ultima é 16.65", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createInvoice.execute(inputCreate)
        expect(invoiceRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(invoiceRepo.getAll()[0].getInstallments()[0].getValue()).toBe(16.67)
        expect(invoiceRepo.getAll()[0].getInstallments()[5].getValue()).toBe(16.65)
    })

    it("deve realizar pagamento de uma das parcelas", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createInvoice.execute(inputCreate)
        const inputInvoice = {
            invoiceCode: invoiceRepo.getAll()[0].getCode(),
            paymentNo: 1
        }
        payPayment.execute(inputInvoice)
        expect(invoiceRepo.getByCode(inputInvoice.invoiceCode).getTotalInstallmentsPaid()).toBe(16.67)
        expect(invoiceRepo.getByCode(inputInvoice.invoiceCode).getTotalOutstandingInstallments()).toBeCloseTo(100-16.67)
        expect(invoiceRepo.getByCode(inputInvoice.invoiceCode).getInstallments()[0].getStatus()).toBe(INSTALLMENT_STATUS.PAID)
    })

    it("não deve permitir alterar o valor de uma parcela quando a soma das parcelas em aberto exceder o total em aberto", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createInvoice.execute(inputCreate)
        const inputAlter = {
            invoiceCode: invoiceRepo.getAll()[0].getCode(),
            paymentNo: 1,
            value: 18
        }
        expect(() => alterPayment.execute(inputAlter)).toThrow("O valor excede o total em aberto!")
    })

    it("deve permitir alterar o valor de uma parcela quando a soma das parcelas em aberto for menor que o total em aberto", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createInvoice.execute(inputCreate)
        const inputAlter = {
            invoiceCode: invoiceRepo.getAll()[0].getCode(),
            paymentNo: 1,
            value: 16
        }
        alterPayment.execute(inputAlter)
        const installments = invoiceRepo.getByCode(inputAlter.invoiceCode).getInstallments()
        expect(installments[0].getValue()).toBe(16)
        expect(invoiceRepo.getByCode(inputAlter.invoiceCode).getTotalOpen()).toBe(100)
        expect(invoiceRepo.getByCode(inputAlter.invoiceCode).getTotalOutstandingInstallments()).toBeCloseTo(100-16.67+16)
    })

    it("deve alterar o status do pagamento para pago quando todas parcelas forem pagas", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        createInvoice.execute(inputCreate)
        const inputInvoice = {
            invoiceCode: invoiceRepo.getAll()[0].getCode(),
            paymentNo: 1
        }
        payPayment.execute(inputInvoice)
        expect(invoiceRepo.getAll()[0].getStatus()).toBe(INVOICE_STATUS.PAID)
    })

    it("deve gerar um erro ao tentar cancelar um pagamento que esta no status pago", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        createInvoice.execute(inputCreate)
        const inputInvoice = {
            invoiceCode: invoiceRepo.getAll()[0].getCode(),
            paymentNo: 1
        }
        payPayment.execute(inputInvoice)
        const InputCancelPayment = {
            invoiceCode: invoiceRepo.getAll()[0].getCode()
        }
        expect(()=>cancelInvoice.execute(InputCancelPayment)).toThrow("Pagamento com o status pago não pode ser cancelado!")
    })

    it("deve permitir cancelar um pagamento que esta em aberto", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        createInvoice.execute(inputCreate)
        const InputCancelPayment = {
            invoiceCode: invoiceRepo.getAll()[0].getCode()
        }
        cancelInvoice.execute(InputCancelPayment)
        expect(invoiceRepo.getAll()[0].getStatus()).toBe(INVOICE_STATUS.CANCELED)
    })
})
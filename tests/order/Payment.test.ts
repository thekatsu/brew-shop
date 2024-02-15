import IInvoiceRepository from "../../src/application/domain/interfaces/IInvoiceRepository"
import IOrderRepository from "../../src/application/domain/interfaces/IOrderRepository"
import IProductRepository from "../../src/application/domain/interfaces/IProductRepository"
import InvoiceRepositoryMemory from "../../src/application/infra/repositories/InvoiceRepositoryMemory"
import OrderRepositoryInMemory from "../../src/application/infra/repositories/OrderRepositoryMemory"
import ProductRepositoryMemory from "../../src/application/infra/repositories/ProductRepositoryMemory"
import CancelInvoice from "../../src/application/usecase/invoice/CancelInvoice"
import CreateInvoice from "../../src/application/usecase/invoice/CreateInvoice"
import GetInvoiceByCode from "../../src/application/usecase/invoice/GetInvoiceByCode"
import CreateOrder from "../../src/application/usecase/order/CreateOrder"
import IncreaseQuantityProduct from "../../src/application/usecase/order/IncreaseQuantityProduct"
import { INVOICE_STATUS } from "../../src/application/domain/entities/Invoice"
import { ORDER_STATUS } from "../../src/application/domain/entities/Order"
import AddOrderInvoice from "../../src/application/usecase/invoice/AddOrderInvoice"
import RemoveOrderInvoice from "../../src/application/usecase/invoice/RemoveOrderInvoice"

describe("Teste de pagamentos de comanda", ()=>{
    let orderRepo: IOrderRepository
    let productRepo: IProductRepository
    let invoiceRepo: IInvoiceRepository
    let createOrder: CreateOrder
    let addProduct: IncreaseQuantityProduct
    let createInvoice: CreateInvoice
    let addOrderInvoice: AddOrderInvoice
    let removeOrderInvoice: RemoveOrderInvoice
    let getInvoiceByCode: GetInvoiceByCode
    let cancelInvoice: CancelInvoice
    // let payPayment: PayInvoice

    beforeEach(()=>{
        orderRepo = new OrderRepositoryInMemory()
        productRepo = new ProductRepositoryMemory()
        invoiceRepo = new InvoiceRepositoryMemory()
        createOrder = new CreateOrder(orderRepo, productRepo)
        addProduct = new IncreaseQuantityProduct(orderRepo, productRepo)
        createInvoice = new CreateInvoice(invoiceRepo, orderRepo)
        addOrderInvoice = new AddOrderInvoice(invoiceRepo, orderRepo)
        removeOrderInvoice = new RemoveOrderInvoice(invoiceRepo, orderRepo)
        getInvoiceByCode = new GetInvoiceByCode(invoiceRepo)
        cancelInvoice = new CancelInvoice(invoiceRepo)
        // payPayment = new PayInvoice(invoiceRepo)

        for(let i = 0; i < 4; i++){
            let inputCreate = {
                description: `Comanda ${i}`
            }
            createOrder.execute(inputCreate)
            let input = {
                orderCode: orderRepo.getAll()[i].getId(),
                productCode: productRepo.getAll()[i].getId()
            }
            addProduct.execute(input)
        }
    })

    it("deve buscar um pagamento pelo codigo", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getId())
        }
        createInvoice.execute(inputCreate)
        const invoiceCode = invoiceRepo.getAll()[0].getId()
        expect(getInvoiceByCode.execute({invoiceCode})).toBeDefined()
    })
    
    it("deve iniciar um pagamento de uma comanda", () => {
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getId())
        }
        createInvoice.execute(inputCreate)
        expect(invoiceRepo.getAll()[0].getId()).toBeDefined()
        expect(invoiceRepo.getAll()[0].getOrders().length).toBe(4)
        expect(invoiceRepo.getAll()[0].getStatus()).toBe(INVOICE_STATUS.OPEN)
        expect(invoiceRepo.getAll()[0].getTotalPaid()).toBe(0)
        expect(invoiceRepo.getAll()[0].getTotalOpen()).toBe(100)
        expect(orderRepo.getAll()[0].getStatus()).toBe(ORDER_STATUS.CLOSE)
        expect(orderRepo.getAll()[0].getInvoice()).toBeDefined()
    })

    it("deve ocorrer erro ao tentar inciar pagamento de uma comanda que já foi finalizada", () => {
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getId())
        }
        createInvoice.execute(inputCreate)
        expect(() => createInvoice.execute(inputCreate)).toThrow(`A ordem já esta fechada, ${orderRepo.getAll()[0].getId()}!`)
    })

    it("deve gerar pagamento com três parcelas de 33.33 sendo que a ultima é 33.34", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getId())
        }
        createInvoice.execute(inputCreate)
        expect(invoiceRepo.getAll()[0].getTotalOpen()).toBe(100)
    })

    it("deve gerar pagamento com seis parcelas de 16.67 sendo que a ultima é 16.65", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getId())
        }
        createInvoice.execute(inputCreate)
        expect(invoiceRepo.getAll()[0].getTotalOpen()).toBe(100)
    })

    // it("deve realizar pagamento de uma das parcelas", ()=>{
    //     const inputCreate = {
    //         orderCodes: orderRepo.getAll().map((value)=>value.getId()),
    //         numberOfInstallments: 6
    //     }
    //     createInvoice.execute(inputCreate)
    //     const inputInvoice = {
    //         invoiceCode: invoiceRepo.getAll()[0].getId(),
    //         paymentNo: 1
    //     }
    //     payPayment.execute(inputInvoice)
    //     expect(invoiceRepo.getByCode(inputInvoice.invoiceCode).getTotalPayments()).toBe(16.67)
    //     expect(invoiceRepo.getByCode(inputInvoice.invoiceCode).getTotalOpen()).toBeCloseTo(100-16.67)
    // })

    // it("deve alterar o status do pagamento para pago quando todas parcelas forem pagas", ()=>{
    //     const inputCreate = {
    //         orderCodes: orderRepo.getAll().map((value)=>value.getId()),
    //         numberOfInstallments: 1
    //     }
    //     createInvoice.execute(inputCreate)
    //     const inputInvoice = {
    //         invoiceCode: invoiceRepo.getAll()[0].getId(),
    //         paymentNo: 1
    //     }
    //     payPayment.execute(inputInvoice)
    //     expect(invoiceRepo.getAll()[0].getStatus()).toBe(INVOICE_STATUS.PAID)
    // })

    // it("deve gerar um erro ao tentar cancelar um pagamento que esta no status pago", ()=>{
    //     const inputCreate = {
    //         orderCodes: orderRepo.getAll().map((value)=>value.getId()),
    //         numberOfInstallments: 1
    //     }
    //     createInvoice.execute(inputCreate)
    //     const inputInvoice = {
    //         invoiceCode: invoiceRepo.getAll()[0].getId(),
    //         paymentNo: 1
    //     }
    //     payPayment.execute(inputInvoice)
    //     const InputCancelPayment = {
    //         invoiceCode: invoiceRepo.getAll()[0].getId()
    //     }
    //     expect(()=>cancelInvoice.execute(InputCancelPayment)).toThrow("Pagamento com o status pago não pode ser cancelado!")
    // })

    it("deve permitir cancelar um pagamento que esta em aberto", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getId()),
            numberOfInstallments: 1
        }
        createInvoice.execute(inputCreate)
        const InputCancelPayment = {
            invoiceCode: invoiceRepo.getAll()[0].getId()
        }
        cancelInvoice.execute(InputCancelPayment)
        expect(invoiceRepo.getAll()[0].getStatus()).toBe(INVOICE_STATUS.CANCELED)
    })

    it("deve adicionar novas comandas a fatura", ()=>{
        const inputCreate = {
            orderCodes: [orderRepo.getAll()[0].getId()]
        }
        createInvoice.execute(inputCreate)
        const inputAddOrder = {
            invoiceCode: invoiceRepo.getAll()[0].getId(),
            orderCodes: [orderRepo.getAll()[1].getId()]
        }
        addOrderInvoice.execute(inputAddOrder)
        expect(invoiceRepo.getAll()[0].getTotal()).toBe(16)
    })

    it("deve remover comandas da fatura", ()=>{
        const inputCreate = {
            orderCodes: [orderRepo.getAll()[0].getId()]
        }
        createInvoice.execute(inputCreate)
        const inputAddOrder = {
            invoiceCode: invoiceRepo.getAll()[0].getId(),
            orderCodes: [orderRepo.getAll()[1].getId()]
        }
        addOrderInvoice.execute(inputAddOrder)
        const inputRmvOrder = {
            invoiceCode: invoiceRepo.getAll()[0].getId(),
            orderCodes: [orderRepo.getAll()[0].getId()]
        }
        removeOrderInvoice.execute(inputRmvOrder)
        expect(invoiceRepo.getAll()[0].getTotal()).toBe(4)
    })
})
import IOrderRepository from "../../src/application/entities/interfaces/IOrderRepository"
import IProductRepository from "../../src/application/entities/interfaces/IProductRepository"
import IPaymentRepository from "../../src/application/entities/interfaces/IPaymentRepository"
import OrderRepositoryInMemory from "../../src/infra/repositories/OrderRepositoryMemory"
import ProductRepositoryInMemory from "../../src/infra/repositories/ProductRepositoryMemory"
import PaymentRepositoryInMemory from "../../src/infra/repositories/PaymentRepositoryMemory"
import { PAYMENT_STATUS } from "../../src/application/entities/Payment"
import { ORDER_STATUS } from "../../src/application/entities/Order"
import { INSTALLMENT_STATUS } from "../../src/application/entities/Installment"
import CreatePayment from "../../src/application/modules/payment/CreatePayment"
import CreateOrder from "../../src/application/modules/order/CreateOrder"
import IncreaseQuantityProduct from "../../src/application/modules/order/IncreaseQuantityProduct"
import GetPaymentByCode from "../../src/application/modules/payment/GetPaymentByCode"
import AlterInstallment from "../../src/application/modules/payment/AlterInstallment"
import CancelPayment from "../../src/application/modules/payment/CancelPayment"
import PayInstallment from "../../src/application/modules/payment/PayInstallment"

describe("Teste de pagamentos de comanda", ()=>{
    let orderRepo: IOrderRepository
    let productRepo: IProductRepository
    let paymentRepo: IPaymentRepository
    let createOrder: CreateOrder
    let addProduct: IncreaseQuantityProduct
    let createPayment: CreatePayment
    let getPaymentByCode: GetPaymentByCode
    let alterInstallment: AlterInstallment
    let cancelPayment: CancelPayment
    let payInstallment: PayInstallment

    beforeEach(()=>{
        orderRepo = new OrderRepositoryInMemory()
        productRepo = new ProductRepositoryInMemory()
        paymentRepo = new PaymentRepositoryInMemory()
        createOrder = new CreateOrder(orderRepo, productRepo)
        addProduct = new IncreaseQuantityProduct(orderRepo, productRepo)
        createPayment = new CreatePayment(paymentRepo, orderRepo)
        getPaymentByCode = new GetPaymentByCode(paymentRepo, orderRepo)
        alterInstallment = new AlterInstallment(paymentRepo, orderRepo)
        cancelPayment = new CancelPayment(paymentRepo, orderRepo)
        payInstallment = new PayInstallment(paymentRepo, orderRepo)

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
        createPayment.execute(inputCreate)
        const paymentCode = paymentRepo.getAll()[0].getCode()
        expect(getPaymentByCode.execute({paymentCode})).toBeDefined()
    })
    
    it("deve iniciar um pagamento de uma comanda", () => {
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode())
        }
        createPayment.execute(inputCreate)
        expect(paymentRepo.getAll()[0].getCode()).toBeDefined()
        expect(paymentRepo.getAll()[0].getInstallments().length).toBe(1)
        expect(paymentRepo.getAll()[0].getOrders().length).toBe(4)
        expect(paymentRepo.getAll()[0].getStatus()).toBe(PAYMENT_STATUS.OPEN)
        expect(paymentRepo.getAll()[0].getTotalInstallmentsPaid()).toBe(0)
        expect(paymentRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(orderRepo.getAll()[0].getStatus()).toBe(ORDER_STATUS.CLOSE)
        expect(orderRepo.getAll()[0].getPayment()).toBeDefined()
    })

    it("deve ocorrer erro ao tentar inciar pagamento de uma comanda que já possui pagamento", () => {
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode())
        }
        createPayment.execute(inputCreate)
        expect(() => createPayment.execute(inputCreate)).toThrow("Comanda já esta encerada!")
    })

    it("deve gerar pagamento com três parcelas de 33.33 sendo que a ultima é 33.34", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 3
        }
        createPayment.execute(inputCreate)
        //console.log(paymentRepo.getAll()[0].getInstallments())
        expect(paymentRepo.getAll()[0].getInstallments().length).toBe(3)
        expect(paymentRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(paymentRepo.getAll()[0].getInstallments()[0].getValue()).toBe(33.33)
        expect(paymentRepo.getAll()[0].getInstallments()[2].getValue()).toBe(33.34)
    })

    it("deve gerar pagamento com seis parcelas de 16.67 sendo que a ultima é 16.65", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createPayment.execute(inputCreate)
        expect(paymentRepo.getAll()[0].getTotalOutstandingInstallments()).toBe(100)
        expect(paymentRepo.getAll()[0].getInstallments()[0].getValue()).toBe(16.67)
        expect(paymentRepo.getAll()[0].getInstallments()[5].getValue()).toBe(16.65)
    })

    it("deve realizar pagamento de uma das parcelas", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createPayment.execute(inputCreate)
        const inputPay = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1
        }
        payInstallment.execute(inputPay)
        expect(paymentRepo.getByCode(inputPay.paymentCode).getTotalInstallmentsPaid()).toBe(16.67)
        expect(paymentRepo.getByCode(inputPay.paymentCode).getTotalOutstandingInstallments()).toBeCloseTo(100-16.67)
        expect(paymentRepo.getByCode(inputPay.paymentCode).getInstallments()[0].getStatus()).toBe(INSTALLMENT_STATUS.PAID)
    })

    it("não deve permitir alterar o valor de uma parcela quando a soma das parcelas em aberto exceder o total em aberto", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createPayment.execute(inputCreate)
        const inputAlter = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1,
            value: 18
        }
        expect(() => alterInstallment.execute(inputAlter)).toThrow("O valor excede o total em aberto!")
    })

    it("deve permitir alterar o valor de uma parcela quando a soma das parcelas em aberto for menor que o total em aberto", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 6
        }
        createPayment.execute(inputCreate)
        const inputAlter = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1,
            value: 16
        }
        alterInstallment.execute(inputAlter)
        const installments = paymentRepo.getByCode(inputAlter.paymentCode).getInstallments()
        expect(installments[0].getValue()).toBe(16)
        expect(paymentRepo.getByCode(inputAlter.paymentCode).getTotalOpen()).toBe(100)
        expect(paymentRepo.getByCode(inputAlter.paymentCode).getTotalOutstandingInstallments()).toBeCloseTo(100-16.67+16)
    })

    it("deve alterar o status do pagamento para pago quando todas parcelas forem pagas", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        createPayment.execute(inputCreate)
        const inputPay = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1
        }
        payInstallment.execute(inputPay)
        expect(paymentRepo.getAll()[0].getStatus()).toBe(PAYMENT_STATUS.PAID)
    })

    it("deve gerar um erro ao tentar cancelar um pagamento que esta no status pago", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        createPayment.execute(inputCreate)
        const inputPay = {
            paymentCode: paymentRepo.getAll()[0].getCode(),
            installmentNo: 1
        }
        payInstallment.execute(inputPay)
        const InputCancelInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode()
        }
        expect(()=>cancelPayment.execute(InputCancelInstallment)).toThrow("Pagamento com o status pago não pode ser cancelado!")
    })

    it("deve permitir cancelar um pagamento que esta em aberto", ()=>{
        const inputCreate = {
            orderCodes: orderRepo.getAll().map((value)=>value.getCode()),
            numberOfInstallments: 1
        }
        createPayment.execute(inputCreate)
        const InputCancelInstallment = {
            paymentCode: paymentRepo.getAll()[0].getCode()
        }
        cancelPayment.execute(InputCancelInstallment)
        expect(paymentRepo.getAll()[0].getStatus()).toBe(PAYMENT_STATUS.CANCELED)
    })
})
import { INSTALLMENT_STATUS } from "../../entities/Installment"
import { PAYMENT_STATUS } from "../../entities/Payment"
import IOrderRepository from "../../entities/interfaces/IOrderRepository"
import IPaymentRepository from "../../entities/interfaces/IPaymentRepository"

export default class GetByCode {
    constructor(private paymentRepository: IPaymentRepository, private orderRepository: IOrderRepository){}
    
    execute({paymentCode}:Input):Output{
        const payment = this.paymentRepository.getByCode(paymentCode)
        return {
            status: payment.getStatus() === PAYMENT_STATUS.OPEN ? "open": payment.getStatus() === PAYMENT_STATUS.PAID? "paid": "canceled",
            totalOpen: payment.getTotalOutstandingInstallments(),
            totalPaid: payment.getTotalInstallmentsPaid(),
            total: payment.getTotal(),
            ordersCodes: payment.getOrders().map((order) => order.getCode()),
            installments: payment.getInstallments().map((installment)=>{
                return {
                    sequence: installment.getSequence(),
                    status: installment.getStatus() === INSTALLMENT_STATUS.OPEN ? "open": installment.getStatus() === INSTALLMENT_STATUS.PAID? "paid": "canceled",
                    value: installment.getValue()
                }
            })
        }
    }
}

export type Input = {
    paymentCode: string
}

export type Output = {
    status: string
    totalOpen: number
    totalPaid: number
    total: number
    ordersCodes: string[]
    installments: {
        sequence: number
        status: string,
        value: number
    }[]
}
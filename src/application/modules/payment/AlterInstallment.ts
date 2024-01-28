import { INSTALLMENT_STATUS } from "../../entities/Installment"
import { PAYMENT_STATUS } from "../../entities/Payment"
import IOrderRepository from "../../entities/interfaces/IOrderRepository"
import IPaymentRepository from "../../entities/interfaces/IPaymentRepository"

export default class AlterInstallment {
    constructor(private paymentRepository: IPaymentRepository, private orderRepository: IOrderRepository){}
    
    execute({paymentCode, installmentNo, value}: Input){
        const payment = this.paymentRepository.getByCode(paymentCode)
        payment.alterInstallment(installmentNo, value)
        this.paymentRepository.save(payment)        
    }
}
export type Input = {
    paymentCode: string,
    installmentNo: number,
    value: number
}

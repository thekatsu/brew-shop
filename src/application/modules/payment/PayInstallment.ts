import IOrderRepository from "../../entities/interfaces/IOrderRepository"
import IPaymentRepository from "../../entities/interfaces/IPaymentRepository"

export default class PayInstallment {
    constructor(private paymentRepository: IPaymentRepository, private orderRepository: IOrderRepository){}
    
    execute({paymentCode, installmentNo}: Input){
        const payment = this.paymentRepository.getByCode(paymentCode)
        payment.payInstallment(installmentNo)
        this.paymentRepository.save(payment)        
    }
}

export type Input = {
    paymentCode: string,
    installmentNo: number
}
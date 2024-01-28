import IOrderRepository from "../../entities/interfaces/IOrderRepository"
import IPaymentRepository from "../../entities/interfaces/IPaymentRepository"

export default class CancelPayment {
    constructor(private paymentRepository: IPaymentRepository, private orderRepository: IOrderRepository){}
    
    execute({paymentCode}: Input){
        const payment = this.paymentRepository.getByCode(paymentCode)
        payment.cancel()
        this.paymentRepository.save(payment)        
    }
}

export type Input = {
    paymentCode: string
}

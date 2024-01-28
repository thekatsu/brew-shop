import Order from "../../entities/Order"
import Payment from "../../entities/Payment"
import IOrderRepository from "../../entities/interfaces/IOrderRepository"
import IPaymentRepository from "../../entities/interfaces/IPaymentRepository"

export default class CreatePayment {
    constructor(private paymentRepository: IPaymentRepository, private orderRepository: IOrderRepository){}
    
    execute({orderCodes, numberOfInstallments = 1}: Input ):void {
        let orders: Order[] = []
        for(const code of orderCodes){
            orders.push(this.orderRepository.getByCode(code))
        }
        const payment = Payment.create(orders, numberOfInstallments)
        for(const order of orders){
            order.setPayment(payment)
            this.orderRepository.save(order)
        }
        this.paymentRepository.save(payment)
    }
}

export type Input = {
    orderCodes: string[],
    numberOfInstallments?: number
}

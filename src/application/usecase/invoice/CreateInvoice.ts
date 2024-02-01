import Order from "../../../domain/entities/Order"
import Invoice from "../../../domain/entities/Invoice"
import IOrderRepository from "../../interfaces/IOrderRepository"
import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class CreateInvoice {
    constructor(private paymentRepository: IInvoiceRepository, private orderRepository: IOrderRepository){}
    
    execute({orderCodes, numberOfPayments = 1}: Input ):void {
        let orders: Order[] = []
        for(const code of orderCodes){
            orders.push(this.orderRepository.getByCode(code))
        }
        const payment = Invoice.create(orders, numberOfPayments)
        for(const order of orders){
            order.setInvoice(payment)
            this.orderRepository.save(order)
        }
        this.paymentRepository.save(payment)
    }
}

export type Input = {
    orderCodes: string[],
    numberOfPayments?: number
}

import Order from "../../domain/entities/Order"
import IInvoiceRepository from "../../domain/interfaces/IInvoiceRepository"
import IOrderRepository from "../../domain/interfaces/IOrderRepository"

export default class AddOrderInvoice {
    constructor(
        private invoiceRepository: IInvoiceRepository,
        private orderRepository: IOrderRepository
    ){}

    execute({invoiceCode, orderCodes}: Input):void {
        const invoice = this.invoiceRepository.getById(invoiceCode)
        let orders: Order[] = []
        for(const code of orderCodes){
            orders.push(this.orderRepository.getById(code))
        }
        invoice.addOrders(orders)
        for(const order of orders){
            this.orderRepository.save(order)
        }
        this.invoiceRepository.save(invoice)
    }
}

export type Input = {
    invoiceCode: string 
    orderCodes: string[]
}
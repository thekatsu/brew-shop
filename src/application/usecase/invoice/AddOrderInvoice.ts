import Invoice from "../../../domain/entities/Invoice"
import Order from "../../../domain/entities/Order"
import IInvoiceRepository from "../../interfaces/IInvoiceRepository"
import IOrderRepository from "../../interfaces/IOrderRepository"

export default class AddOrderInvoice {
    constructor(
        private invoiceRepository: IInvoiceRepository,
        private orderRepository: IOrderRepository
    ){}

    execute({invoiceCode, orderCodes}: Input):void {
        const invoice = this.invoiceRepository.getByCode(invoiceCode)
        let orders: Order[] = []
        for(const code of orderCodes){
            orders.push(this.orderRepository.getByCode(code))
        }
        invoice.addOrders(orders)
        for(const order of orders){
            order.setInvoice(invoice)
            this.orderRepository.save(order)
        }
        this.invoiceRepository.save(invoice)
    }
}

export type Input = {
    invoiceCode: string 
    orderCodes: string[]
}
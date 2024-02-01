import Invoice from "../../../domain/entities/Invoice"
import Order from "../../../domain/entities/Order"

export default class AddOrderInvoice {
    constructor(){}

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
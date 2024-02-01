import Order from "../../../domain/entities/Order"
import Invoice from "../../../domain/entities/Invoice"
import IOrderRepository from "../../interfaces/IOrderRepository"
import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class CreateInvoice {
    constructor(private invoiceRepository: IInvoiceRepository, private orderRepository: IOrderRepository){}
    
    execute({orderCodes, numberOfInstallments = 1}: Input ):void {
        let orders: Order[] = []
        for(const code of orderCodes){
            orders.push(this.orderRepository.getByCode(code))
        }
        const invoice = Invoice.create(orders, numberOfInstallments)
        for(const order of orders){
            order.setInvoice(invoice)
            this.orderRepository.save(order)
        }
        this.invoiceRepository.save(invoice)
    }
}

export type Input = {
    orderCodes: string[],
    numberOfInstallments?: number
}

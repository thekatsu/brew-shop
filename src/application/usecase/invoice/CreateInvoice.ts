import Invoice from "../../domain/entities/Invoice"
import Order from "../../domain/entities/Order"
import IInvoiceRepository from "../../domain/interfaces/IInvoiceRepository"
import IOrderRepository from "../../domain/interfaces/IOrderRepository"

export default class CreateInvoice {
    constructor(private invoiceRepository: IInvoiceRepository, private orderRepository: IOrderRepository){}
    
    execute({orderCodes}: Input ):void {
        let orders: Order[] = []
        for(const code of orderCodes){
            orders.push(this.orderRepository.getById(code))
        }
        const invoice = Invoice.create(orders)
        for(const order of orders){
            this.orderRepository.save(order)
        } 
        this.invoiceRepository.save(invoice)
    }
}

export type Input = {
    orderCodes: string[]
}

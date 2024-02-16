import { INVOICE_STATUS } from "../../domain/entities/Invoice"
import IInvoiceRepository from "../../domain/interfaces/IInvoiceRepository"

export default class GetByCode {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode}:Input):Output{
        const invoice = this.invoiceRepository.getById(invoiceCode)
        return {
            status: invoice.getStatus() === INVOICE_STATUS.OPEN ? "open": invoice.getStatus() === INVOICE_STATUS.PAID? "paid": "canceled",
            totalOpen: invoice.getTotalOpen(),
            totalPaid: invoice.getTotalPaid(),
            total: invoice.getTotal(),
            ordersCodes: invoice.getOrders().map((order) => order.getId()),
            installments: invoice.getPayments().map((payment, sequence)=>{
                return {
                    sequence: sequence+1,
                    value: payment.getValue()
                }
            })
        }
    }
}

export type Input = {
    invoiceCode: string
}

export type Output = {
    status: string
    totalOpen: number
    totalPaid: number
    total: number
    ordersCodes: string[]
    installments: {
        sequence: number
        value: number
    }[]
}
import { PAYMENT_STATUS } from "../../../domain/entities/Payment"
import { INVOICE_STATUS } from "../../../domain/entities/Invoice"
import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class GetByCode {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode}:Input):Output{
        const invoice = this.invoiceRepository.getByCode(invoiceCode)
        return {
            status: invoice.getStatus() === INVOICE_STATUS.OPEN ? "open": invoice.getStatus() === INVOICE_STATUS.PAID? "paid": "canceled",
            totalOpen: invoice.getTotalOutstandingPayments(),
            totalPaid: invoice.getTotalPaymentsPaid(),
            total: invoice.getTotal(),
            ordersCodes: invoice.getOrders().map((order) => order.getCode()),
            payments: invoice.getPayments().map((payment)=>{
                return {
                    sequence: payment.getSequence(),
                    status: payment.getStatus() === PAYMENT_STATUS.OPEN ? "open": payment.getStatus() === PAYMENT_STATUS.PAID? "paid": "canceled",
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
    payments: {
        sequence: number
        status: string,
        value: number
    }[]
}
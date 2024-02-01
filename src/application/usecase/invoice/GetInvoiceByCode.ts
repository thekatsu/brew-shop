import { INSTALLMENT_STATUS } from "../../../domain/entities/Installment"
import { INVOICE_STATUS } from "../../../domain/entities/Invoice"
import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class GetByCode {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode}:Input):Output{
        const invoice = this.invoiceRepository.getByCode(invoiceCode)
        return {
            status: invoice.getStatus() === INVOICE_STATUS.OPEN ? "open": invoice.getStatus() === INVOICE_STATUS.PAID? "paid": "canceled",
            totalOpen: invoice.getTotalOutstandingInstallments(),
            totalPaid: invoice.getTotalInstallmentsPaid(),
            total: invoice.getTotal(),
            ordersCodes: invoice.getOrders().map((order) => order.getCode()),
            installments: invoice.getInstallments().map((payment)=>{
                return {
                    sequence: payment.getSequence(),
                    status: payment.getStatus() === INSTALLMENT_STATUS.OPEN ? "open": payment.getStatus() === INSTALLMENT_STATUS.PAID? "paid": "canceled",
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
        status: string,
        value: number
    }[]
}
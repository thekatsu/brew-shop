import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class PayInvoice {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode, paymentNo}: Input){
        const invoice = this.invoiceRepository.getByCode(invoiceCode)
        invoice.payInvoice(paymentNo)
        this.invoiceRepository.save(invoice)        
    }
}

export type Input = {
    invoiceCode: string,
    paymentNo: number
}
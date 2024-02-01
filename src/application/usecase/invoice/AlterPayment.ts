import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class AlterPayment {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode, paymentNo, value}: Input){
        const invoice = this.invoiceRepository.getByCode(invoiceCode)
        invoice.alterInvoice(paymentNo, value)
        this.invoiceRepository.save(invoice)        
    }
}
export type Input = {
    invoiceCode: string,
    paymentNo: number,
    value: number
}

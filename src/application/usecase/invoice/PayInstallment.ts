import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class payInstallment {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode, paymentNo}: Input){
        const invoice = this.invoiceRepository.getByCode(invoiceCode)
        invoice.payInstallment(paymentNo)
        this.invoiceRepository.save(invoice)        
    }
}

export type Input = {
    invoiceCode: string,
    paymentNo: number
}
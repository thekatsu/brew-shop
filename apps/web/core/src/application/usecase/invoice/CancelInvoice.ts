import IInvoiceRepository from "../../domain/interfaces/IInvoiceRepository"

export default class CancelInvoice {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode}: Input){
        const invoice = this.invoiceRepository.getById(invoiceCode)
        invoice.cancel()
        this.invoiceRepository.save(invoice)        
    }
}

export type Input = {
    invoiceCode: string
}

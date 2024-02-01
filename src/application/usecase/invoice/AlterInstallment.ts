import IInvoiceRepository from "../../interfaces/IInvoiceRepository"

export default class alterInstallment {
    constructor(private invoiceRepository: IInvoiceRepository){}
    
    execute({invoiceCode, paymentNo, value}: Input){
        const invoice = this.invoiceRepository.getByCode(invoiceCode)
        invoice.alterInstallment(paymentNo, value)
        this.invoiceRepository.save(invoice)        
    }
}
export type Input = {
    invoiceCode: string,
    paymentNo: number,
    value: number
}

import IInvoiceRepository from "../../application/interfaces/IInvoiceRepository"
import Invoice from "../../domain/entities/Invoice"

export default class InvoiceRepositoryMemory implements IInvoiceRepository{
    private payments: Invoice[] = []

    save(invoice: Invoice): void {
        if(this.payments.indexOf(invoice) !== -1){
            this.payments[this.payments.indexOf(invoice)] = invoice
        } else {
            this.payments.push(invoice)
        }
    }

    getAll(): Invoice[] {
        return this.payments
    }
    
    getByCode(code: string) {
        const invoice = this.payments.find((invoice)=>invoice.getCode() === code)
        if(!invoice) throw new Error("Fatura não localizada!")
        return invoice
    }
}
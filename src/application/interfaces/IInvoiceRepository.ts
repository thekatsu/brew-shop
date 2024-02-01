import Invoice from "../../domain/entities/Invoice"

export default interface IInvoiceRepository{
    getAll(): Invoice[]
    getByCode(code:string): Invoice
    save(payment: Invoice): void
}
import Payment from "../Payment"

export default interface IPaymentGuestCheckPadRepository{
    getAll():Payment[]
    getByCode(code:string):Payment
    save(payment: Payment): void
}
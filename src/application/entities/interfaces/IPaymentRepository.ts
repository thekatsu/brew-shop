import Order from "../Order"
import Payment from "../Payment"

export default interface IPaymentRepository{
    getAll(): Payment[]
    getByCode(code:string): Payment
    save(payment: Payment): void
}
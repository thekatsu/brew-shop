import Payment from "../../application/entities/Payment";
import IPaymentRepository from "../../application/entities/interfaces/IPaymentRepository";

export default class PaymentRepositoryMemory implements IPaymentRepository{
    private payments: Payment[] = []

    save(payment: Payment): void {
        if(this.payments.indexOf(payment) !== -1){
            this.payments[this.payments.indexOf(payment)] = payment
        } else {
            this.payments.push(payment)
        }
    }

    getAll(): Payment[] {
        return this.payments
    }
    
    getByCode(code: string) {
        const payment = this.payments.find((payment)=>payment.getCode() === code)
        if(!payment) throw new Error("Pagamento não localizado!")
        return payment
    }
}
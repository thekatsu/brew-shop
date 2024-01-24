import GuestCheckPad from "../../entities/GuestCheckPad"
import { INSTALLMENT_STATUS } from "../../entities/Installment"
import Payment, { PAYMENT_STATUS } from "../../entities/Payment"
import IGuestCheckPadRepository from "../../entities/interfaces/IGuestCheckPadRepository"
import IPaymentGuestCheckPadRepository from "../../entities/interfaces/IPaymentGuestCheckPadRepository"

export default class PaymentGuestCheckPadService {
    constructor(private paymentRepository: IPaymentGuestCheckPadRepository, private guestCheckPadRepository: IGuestCheckPadRepository){}
    
    create(input: InputCreate ):void {
        let guestCheckPads: GuestCheckPad[] = []
        for(const code of input.guestCheckPadCodes){
            guestCheckPads.push(this.guestCheckPadRepository.getByCode(code))
        }
        const payment = Payment.create(guestCheckPads, input.numberOfInstallments)
        for(const guestCheckPad of guestCheckPads){
            guestCheckPad.setPayment(payment)
            this.guestCheckPadRepository.save(guestCheckPad)
        }
        this.paymentRepository.save(payment)
    }

    getByCode(input:InputGetByCode):OutputGetByCode{
        const payment = this.paymentRepository.getByCode(input.paymentCode)
        return {
            status: payment.getStatus(),
            totalOpen: payment.getTotalOutstandingInstallments(),
            totalPaid: payment.getTotalInstallmentsPaid(),
            total: payment.getTotal(),
            guestCheckPadsCodes: payment.getGuestCheckPads().map((guestCheckPad) => guestCheckPad.getCode()),
            installments: payment.getInstallments().map((installment)=>{
                return {
                    sequence: installment.getSequence(),
                    status: installment.getStatus(),
                    value: installment.getValue()
                }
            })
        }
    }

    cancelPayment(input: InputCancelPayment){
        const payment = this.paymentRepository.getByCode(input.paymentCode)
        payment.cancel()
        this.paymentRepository.save(payment)        
    }

    payInstallment(input: InputPayInstallment){
        const payment = this.paymentRepository.getByCode(input.paymentCode)
        payment.payInstallment(input.installmentNo)
        this.paymentRepository.save(payment)        
    }

    alterInstallment(input: InputAlterInstallment){
        const payment = this.paymentRepository.getByCode(input.paymentCode)
        payment.alterInstallment(input.installmentNo, input.value)
        this.paymentRepository.save(payment)        
    }
}

export type InputCreate = {
    guestCheckPadCodes: string[],
    numberOfInstallments?: number
}

export type InputGetByCode = {
    paymentCode: string
}

export type OutputGetByCode = {
    status: PAYMENT_STATUS
    totalOpen:number
    totalPaid:number
    total:number
    guestCheckPadsCodes:string[]
    installments: {
        sequence:number
        status:INSTALLMENT_STATUS,
        value:number
    }[]
}

export type InputPayInstallment = {
    paymentCode: string,
    installmentNo: number
}

export type InputAlterInstallment = {
    paymentCode: string,
    installmentNo: number,
    value: number
}

export type InputCancelPayment = {
    paymentCode: string
}

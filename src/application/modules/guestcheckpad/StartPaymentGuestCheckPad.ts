import GuestCheckPad from "../../entities/GuestCheckPad"
import Payment from "../../entities/Payment"
import IGuestCheckPadRepository from "../../entities/interfaces/IGuestCheckPadRepository"
import IPaymentGuestCheckPadRepository from "../../entities/interfaces/IPaymentGuestCheckPadRepository"

export default class StartPaymentGuestCheckPad{
    constructor(private repoPayment: IPaymentGuestCheckPadRepository, private repoGuestCheckPad: IGuestCheckPadRepository){}
    
    execute(input: Input ):void {
        let guestcheckpad: GuestCheckPad[] = []
        for(const code of input.guestcheckpad_codes){
             guestcheckpad.push(this.repoGuestCheckPad.getByCode(code))
        }

        const payment = Payment.create({
            number_of_installments: input.number_of_installments, 
            guestcheckpads: guestcheckpad
        })

        this.repoPayment.save(payment)
    }
}

type Input = {
    guestcheckpad_codes: string[]
    number_of_installments: number
}
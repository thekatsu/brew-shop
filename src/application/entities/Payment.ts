import { randomUUID } from 'crypto'
import GuestCheckPad from "./GuestCheckPad";
import Installment from "./Installment";

export default class Payment{
    private installments: Installment[] = []
    private total: number = 0
    private total_open: number = 0
    
    constructor(readonly code: string, private guestcheckpads: GuestCheckPad[], private number_of_installments: number = 1){
        this.calculateTotal()
        this.calculateTotalOpen()
        this.generateInstallments()
    }

    public static create({code, guestcheckpads, number_of_installments}:{code?:string, guestcheckpads: GuestCheckPad[], number_of_installments: number}): Payment{
        if(!code) code = randomUUID()
        return new Payment(code, guestcheckpads, number_of_installments)
    }

    getCode(){
        return this.code
    }

    calculateTotal(){
        this.guestcheckpads.forEach((guestcheckpad)=>{
            this.total += guestcheckpad.getTotal()
        })
    }

    calculateTotalOpen(){
        this.total_open += this.getTotalOutstandingInstallments() - this.getTotalInstallmentsPaid()
    }

    getTotalOutstandingInstallments(){
        return this.installments
            .filter((installment)=>installment.status !== "pago")
            .map((installment)=>installment.value)
            .reduce((accumulador, current)=>{
                return accumulador + current
            }, 0)
    }

    getGuestCheckPads(){
        return this.guestcheckpads
    }

    getInstallments(){
        return this.installments
    }

    getTotalInstallmentsPaid(){
        return this.installments
            .filter((installment)=>installment.status === "pago")
            .map((installment)=>installment.value)
            .reduce((accumulador, current)=>{
                return accumulador + current
            }, 0)
    }

    setNumberOfInstallments(number:number){
        this.number_of_installments = number
    }

    generateInstallments(){
        const value_of_installment = Math.round((this.total/this.number_of_installments)*100)/100
        let sum_of_installments = 0
        this.installments = this.installments.filter((installment)=>installment.status === "pago")
        for(let i = 0; i < this.number_of_installments; i++ ){
            let value = value_of_installment
            if(i !== this.number_of_installments-1){
                if(sum_of_installments + value < this.total_open){
                    value += this.total_open - (sum_of_installments + value)
                } else {
                    value += (sum_of_installments + value) - this.total_open
                }
            }
            sum_of_installments += value
            
            this.installments.push(new Installment(this.code, i, value))
        }
    }
}
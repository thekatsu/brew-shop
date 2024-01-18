export default class Istallment{
    readonly status:string = "aberto"
    constructor(readonly payment_code: string, readonly sequence: number, readonly value: number){}

}
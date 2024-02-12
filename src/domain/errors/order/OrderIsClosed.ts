export default class OrderIsClosed extends Error{
    constructor(message?:string){
        super()
        this.name = "OrderIsClosed"
        this.message = `A ordem já esta fechada${", "+message}!`
    }
}
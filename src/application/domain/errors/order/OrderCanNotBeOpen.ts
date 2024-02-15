export default class OrderCanNotBeOpen extends Error{
    constructor(){
        super()
        this.name = "OrderCanNotBeOpen"
        this.message = "A ordem não pode se reaberta!"
    }
}
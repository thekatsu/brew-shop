export default class ItemOrderNotFound extends Error{
    constructor(){
        super()
        this.name = "ItemOrderNotFound"
        this.message = "Produto não encontrado na ordem!"
    }
}
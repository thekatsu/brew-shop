import Order from "../../application/entities/Order"
import Item from "../../application/entities/Item"
import IOrderRepository from "../../application/entities/interfaces/IOrderRepository"

export default class OrderRepositoryMemory implements IOrderRepository {
    private orders: Order[] = []
    
    constructor(){}
    
    save(order: Order):void {
        if(this.orders.indexOf(order) !== -1){
            this.orders[this.orders.indexOf(order)] = order
        } else {
            this.orders.push(order)
        }
    }

    getByCode(code: string):Order {
        const order = this.orders.find((order)=> order.getCode() === code )
        if(!order) throw new Error("Comanda não encontrada!")
        return order
    }

    getAll():Order[]{
        return this.orders
    }

    getItemsByProductCode(orderCode: string, productCode: string):Item[]{
        const order = this.getByCode(orderCode)
        const item = order.getItemsByProductCode(productCode)
        return item
    }
}
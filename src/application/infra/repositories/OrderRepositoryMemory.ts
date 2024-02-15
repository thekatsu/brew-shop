import IOrderRepository from "../../domain/interfaces/IOrderRepository"
import Item from "../../domain/entities/Item"
import Order from "../../domain/entities/Order"

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

    getById(code: string):Order {
        const order = this.orders.find((order)=> order.getId() === code )
        if(!order) throw new Error("Comanda não encontrada!")
        return order
    }

    getAll():Order[]{
        return this.orders
    }

    getItemsByProductId(orderCode: string, productCode: string):Item[]{
        const order = this.getById(orderCode)
        const item = order.getItems().filter(item => item.getProductId() === productCode)
        return item
    }
}

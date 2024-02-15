import Item from "../../domain/entities/Item"
import Order from "../../domain/entities/Order"

export default interface IOrderRepository {
    save(order: Order): void
    getById(code: string): Order
    getAll():Order[]
    getItemsByProductId(orderCode: string, productCode: string):Item[]
}
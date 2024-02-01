import Item from "../../domain/entities/Item"
import Order from "../../domain/entities/Order"

export default interface IOrderRepository {
    save(order: Order): void
    getByCode(code: string): Order
    getAll():Order[]
    getItemsByProductCode(orderCode: string, productCode: string):Item[]
}
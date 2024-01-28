import Order from "../Order"
import Item from "../Item"

export default interface IOrderRepository {
    save(order: Order): void
    getByCode(code: string): Order
    getAll():Order[]
    getItemsByProductCode(orderCode: string, productCode: string):Item[]
}
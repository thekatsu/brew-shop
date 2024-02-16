import IOrderRepository from "../../domain/interfaces/IOrderRepository"
import IProductRepository from "../../domain/interfaces/IProductRepository"

export default class IncreaseQuantityProduct {

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute({orderCode, productCode, quantity = 1}: Input):void{
        const product = this.productRepository.getById(productCode)
        const order = this.orderRepository.getById(orderCode)
        if(!order) throw new Error("Comanda não encontrada!")
        const hasProduct = order.getItems().some(item => item.getProductId() === productCode);
        if(!hasProduct) {
            order.addItem(product.getId(), quantity, product.getPrice())
        }else{
            order.increaseItemQuantity(productCode, quantity)
        }
        this.orderRepository.save(order)
    }
}

export type Input = {
    orderCode: string,
    productCode: string
    quantity?: number
}
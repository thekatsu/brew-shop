import IOrderRepository from "../../domain/interfaces/IOrderRepository"
import IProductRepository from "../../domain/interfaces/IProductRepository"

export default class DecreaseQuantityProduct {

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute({orderCode, productCode, quantity = 1}:Input):void{
        const order = this.orderRepository.getById(orderCode)
        if(!order) throw new Error("Comanda não encontrada!")
        order.decreaseItemQuantity(productCode, quantity)
        this.orderRepository.save(order)
    }
}

export type Input = {
    orderCode: string
    productCode: string
    quantity?: number
}
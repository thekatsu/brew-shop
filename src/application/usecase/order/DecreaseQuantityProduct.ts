import IOrderRepository from "../../interfaces/IOrderRepository"
import IProductRepository from "../../interfaces/IProductRepository"

export default class DecreaseQuantityProduct {

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute({orderCode, productCode, quantity = 1, sequence = 1}:Input):void{
        const order = this.orderRepository.getByCode(orderCode)
        if(!order) throw new Error("Comanda não encontrada!")
        order.decreaseAmount(productCode, sequence, quantity)
        this.orderRepository.save(order)
    }
}

export type Input = {
    orderCode: string
    productCode: string
    quantity?: number
    sequence?: number
}
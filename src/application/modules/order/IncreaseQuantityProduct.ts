import IOrderRepository from "../../entities/interfaces/IOrderRepository";
import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class IncreaseQuantityProduct {

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute({orderCode, productCode, quantity = 1, sequence = 1}: Input):void{
        const product = this.productRepository.getByCode(productCode)
        const order = this.orderRepository.getByCode(orderCode)
        if(!order) throw new Error("Comanda não encontrada!")
        order.addItem(product.getCode(), product.getPrice(), 0)
        order.increaseAmount(productCode, sequence, quantity)
        this.orderRepository.save(order)
    }
}

export type Input = {
    orderCode: string,
    productCode: string
    quantity?: number
    sequence?: number
}
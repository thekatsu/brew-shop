import Order from "../../entities/Order";
import IOrderRepository from "../../entities/interfaces/IOrderRepository";
import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class CreateOrder {

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute(input?: Input | undefined):void{
        const {description} = input || {}
        const order = Order.create(description);
        this.orderRepository.save(order)
    }
}

export type Input = {
    description?:string
}
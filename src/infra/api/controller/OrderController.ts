import IHttpServer from "../../../application/api/IHttpServer";
import OrderService from "../../../application/modules/order/CreateOrder";


export default class GuestCheckPadController{

    constructor(private router:IHttpServer, private orderService: OrderService){
        
    }

    public teste(tst:string){}
}
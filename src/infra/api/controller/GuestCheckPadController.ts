import IHttpServer from "../../../application/api/IHttpServer";
import GuestCheckPadService from "../../../application/modules/guestcheckpad/GuestCheckPadService";

export default class GuestCheckPadController{

    constructor(private router:IHttpServer, private guestCheckPadService:GuestCheckPadService){
        
    }

    public teste(tst:string){}
}
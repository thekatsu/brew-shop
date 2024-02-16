import IHttpServer from "./application/interfaces/IHttpServer";
import ExpressAdapter from "./infra/api/ExpressAdapter";



const server: IHttpServer = new ExpressAdapter('/')



server.listen(3000, ()=>{
    console.log("Server ouvindo na porta 3000!")
})


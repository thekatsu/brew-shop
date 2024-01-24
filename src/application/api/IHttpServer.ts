export default interface HttpServer {
    register(method:string, path:string, callback:Function):void
    listen(port:number, callback:Function):void
}
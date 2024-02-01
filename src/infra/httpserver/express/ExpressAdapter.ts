import express, {json, Request, Response } from 'express'
import IHttpServer, { HttpOptions } from '../../application/api/IHttpServer'

export default class ExpressAdapter implements IHttpServer {
  private express = express()

  constructor(private basePath:string){
    this.express.use(json())
  }

  register({method, path, callback}:HttpOptions): void {
      // @ts-ignore
      this.express[method](`${basePath}/${path}`, async function(req: Request, res:Response){
          const output = await callback(req.params, req.body)
          res.json(output)
      })
  }

  listen(port:number, callback:Function){
    this.express.listen(port, ()=>{
      callback(`Example app listening on port ${port}`)
    })
  }
}
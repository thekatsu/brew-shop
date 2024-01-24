import fs from "node:fs"
import { join, resolve, } from 'node:path';

const pathControllers = join(resolve(), "src", "infra", "api", "controller")
const controllers = []
const modules: {module:any, actions:string[]}[] = []

fs.readdir(pathControllers, async (err, fileName)=>{
    const className = fileName.toString().replace(".ts","")
    const controllerName = fileName.toString().replace("Controller.ts","").toLowerCase()
    controllers.push(controllerName)
    
    const module = (await import(join(__dirname,"controller", fileName.toString()))).default

    console.log(Object.getOwnPropertyDescriptors(module.prototype).teste.value)

    // @ts-ignore
    modules[controllerName] = {
        module,
        actions: []
    }

    // @ts-ignore
    for(const action of Object.getOwnPropertyNames(module.prototype)){
        if(action != 'constructor'){
            // @ts-ignore
            modules[controllerName].actions.push(action)
        }
    }

    // @ts-ignore
    console.log(modules)
})
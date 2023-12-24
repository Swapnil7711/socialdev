import { Request, Response, NextFunction } from "express"

const registerController = {
    register(req: Request, res:Response, next:NextFunction){
        res.json({"msg":"message"})
    }
}

export default registerController;
import { Request, Response, NextFunction} from "express"
import {registerSchema} from  "common"
const registerController = {
    register(req: Request, res:Response, next:NextFunction){

        // validate the request with zod or joi
        try {
            const result=registerSchema.parse(req.body)
            console.log("result", result)
        } catch (error:any) {
            console.log(error.errors[0].message)
        }
        
     
        // authorise the request
        // check if user is already in the database
        // prepare model
        // store ion database
        // generate jwt token
        // send response

        res.json({"msg":"message"})
    }
}

export default registerController;
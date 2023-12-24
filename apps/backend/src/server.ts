import express, {Express} from "express"
import {PORT} from './config'
import router from "./routes"
import bodyParser from "body-parser"
import errorHandler from "./middlewares/errorHandler"


const app:Express = express()
app.use(bodyParser.json())

app.use("/api", router)

app.use(errorHandler)
app.listen(PORT, ()=>{
    console.log(`app started on ${PORT}`) 
})
import express, {Express} from "express"
import {PORT} from './config'
import router from "./routes"


const app:Express = express()

app.use("/api", router)

app.listen(PORT, ()=>{
    console.log(`app started on ${PORT}`) 
})
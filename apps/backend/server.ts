import express, {Express} from "express"
import {PORT} from './config'
const app:Express = express()


app.get("/", (req, res,next)=>{
    res.json({"msg":"message"})
})

app.listen(PORT, ()=>{
    console.log(`app started on ${PORT}`) 
})
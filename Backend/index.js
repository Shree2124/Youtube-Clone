// import mongoose from "mongoose";
// import {DB_NAME} from './constants'
// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./src/db/index.js";
import { app } from './src/app.js';

dotenv.config({
    path: './.env'
})
connectDB()
.then(()=>{
    const port = process.env.PORT || 8000
    app.listen(port, ()=>console.log(`Server is running at port : ${port}`))
})
.catch((error)=>console.log("MONGODB CONNECTION ERROR in index.js: ",error))

app.get("/",(req, res)=>{
    res.send("hello")
})
// import mongoose from "mongoose";
// import {DB_NAME} from './constants'
// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path: './.env'
})
connectDB()
.then(()=>{
    const port = process.env.PORT || 8000
    app.listen(port, ()=>console.log(`Server is running at port : ${port}`))
})
.catch((error)=>console.log("MONGODB CONNECTION ERROR in index.js: ",error))









/*
// TODO: ⁡⁢⁢⁢first approch to connect db
import express  from "express";
const app = express()
⁡
(async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", ()=>{
            console.log("ERROR: ", error);
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`APP is listenign on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR: ",error)
        throw error
    }
})()
*/
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const express = require('express');
const app=express();
const mongoose = require('mongoose');

app.use(express.json())
//DB CONNECTION
const DB=process.env.DB_REMOTE_STRING;
mongoose.connect(DB,{useNewUrlParser:true})
.then(()=>{console.log("DB Remote connection successful...");}
)
.catch(err=>{console.log(`Error:${err}`);})

//MOUNTING ROUTER ON SOME ROUTE
const productRouter = require('./Routes/product');
app.use('/api/v1/product',productRouter);

const port=process.env.PORT||5000;
app.listen(port,()=>{
    console.log(`Server running at the port${port}`);
})
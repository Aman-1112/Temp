var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const express = require('express');
const mongoose = require('mongoose');

const app=express();
app.use(cors());
app.use(express.json());

//DB CONNECTION
const DB=process.env.DB_REMOTE_STRING;
mongoose.connect(DB,{useNewUrlParser:true})
.then(()=>{console.log("DB Remote connection successful...");}
)
.catch(err=>{console.log(`Error:${err}`);})

//MOUNTING ROUTER ON SOME ROUTE
app.use('/api/v1/product', require('./product-api/Routes/product'));
app.use('/api/auth', require('./Users/routes/auth'));
const port=process.env.PORT||5000;

if(process.env.NODE_ENV==="production"){
    app.use(express.static("Client/build"));
    const path = require("path");
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'Client','build','index.html'));
    })
}

app.listen(port,()=>{
    console.log(`Server running at the port${port}`);
})
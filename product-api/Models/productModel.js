const mongoose = require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A Product must have name']
    },
    brand:{
        type:String,
        required:[true,'A Product must have brand']
    },
    image:{
        type:String,
        required:[true,'A Product must have image']
    },
    category:{
        type:String,
        required:[true,'A Product must belong to category']
    },
    price:{
        type:Number,
        required:[true,'A Product must have price']
    },
    description:{
        type:String
    }
});

const productModel= mongoose.model('productList',productSchema);
module.exports=productModel ;
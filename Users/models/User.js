const productModel=require('../../product-api/Models/productModel'); 
const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar:String,
    email: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String
        // ,
        // required: true //DUE TO FB AND GOOGLE
    },
    myCart:[
        {
        type:Object
        }
    ],
    orders:[
        {
            orderedItems:[{
                // productId:{type:Schema.Types.ObjectId,ref:'productModel'},
                productName:String,
                quantity:Number
            }],
            shippingAddress:{
                phoneNo:Number,
                streetAddress:String,
                city:String,
                zipCode:Number,
                country:String,
            },
            orderedAt:{
                type:Date,
                default: Date.now  //Both are correct ... this is function
            },
            deliveryDate:String
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    fbId:String,
    createdAt: {
        type: Date,
        default: ()=>Date.now() //Both are correct ... 
    }
});

module.exports = mongoose.model('user', userSchema);
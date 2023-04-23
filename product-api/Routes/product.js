const express = require('express');
const {getProductList,getProduct,getSearchItem,createProduct} = require('../Controllers/product');

const productRouter=express.Router();

productRouter
.route('/List')
.get(getProductList);

productRouter
.route('/:id')
.get(getProduct);

productRouter
.route('/search/:searchItem')
.get(getSearchItem);

productRouter
.route('/create')
.post(createProduct);

module.exports=productRouter;
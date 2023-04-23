const productModel= require('../Models/productModel');

exports.getProductList = async (req, res) => {
    try {
        console.log(req.query);
        let  query = productModel.find();
        //pagination and limit
        let page=req.query.page||1;
        let limit=req.query.limit||4;
        let skip=(page-1)*limit;

        const productList=await query.skip(skip).limit(limit);
        res.status(200).json({
            status: "success",
            results: productList.length,
            data: productList
        })
    } catch (error) {
        res.status(500).json({
            message: "Some Error happened on Our Side",
            Error: error
        });
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).json({
        status: "success",
        data: product
    })
    } catch (error) {
        res.status(500).json({
            message: "Some Error happened on Our Side",
            Error: error
        });
    }
    
}

exports.getSearchItem = async (req, res) => {
    try {
        let str = req.params.searchItem;
    var regex = new RegExp(`${str}`, "ig")
    console.log(regex);
    const productList = await productModel.find({ name: regex })
    res.status(200).json({
        status: "success",
        results: productList.length,
        productList
    })
    } catch (error) {
        res.status(500).json({
            message: "Some Error happened on Our Side",
            Error: error
        });
    }
    
}

exports.createProduct = async(req,res)=>{
    console.log(req.body);
    await productModel.create(req.body);
    res.send(200).send();
}
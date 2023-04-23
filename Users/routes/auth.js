const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const { find, findByIdAndUpdate } = require('../models/User');
// const productModel=require('../../product-api/Models/productModel')
const JWT_SECRET = 'qwert12345';

// create a user using POST "/api/auth/createuser"
router.post('/createuser', [
    body('name', 'Name should have atleast 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should have atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Email-id is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const seqPass = await bcrypt.hash(req.body.password, salt);

        /*******avatar logic */
        const [first,second]=req.body.name.split(/\s+/);
        const colorArray = ['FF6633', 'FFB399', 'FF33FF', 'FFFF99', '00B3E6', 
		  'E6B333', '3366E6', '999966', '99FF99', 'B34D4D',
		  '80B300', '809900', 'E6B3B3', '6680B3', '66991A', 
		  'FF99E6', 'CCFF1A', 'FF1A66', 'E6331A', '33FFCC',
		  '66994D', 'B366CC', '4D8000', 'B33300', 'CC80CC', 
		  '66664D', '991AFF', 'E666FF', '4DB3FF', '1AB399',
		  'E666B3', '33991A', 'CC9999', 'B3B31A', '00E680', 
		  '4D8066', '809980', 'E6FF80', '1AFF33', '999933',
		  'FF3380', 'CCCC00', '66E64D', '4D80CC', '9900B3', 
		  'E64D66', '4DB380', 'FF4D4D', '99E6E6', '6666FF'];
        let random=Math.floor(Math.random()*50);
        /******************* */
        user = await User.create({
            name: req.body.name,
            avatar:`https://ui-avatars.com/api/?name=${first}+${second}?background=${colorArray[random]}`,
            email: req.body.email,
            password: seqPass,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        await User.findByIdAndUpdate(user.id, { $push: { tokens: { token: authtoken } } })
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

/********FB AND GOOGLE LOGIN **********/
router.post('/fbLogin', async (req, res) => {
    // console.log(req.body);
    try {
        let fbUser = await User.findOne({ fbId: req.body.id });
        if (!fbUser) {       
        /*******avatar logic */
        const [first,second]=req.body.name.split(/\s+/);
        const colorArray = ['FF6633', 'FFB399', 'FF33FF', 'FFFF99', '00B3E6', 
		  'E6B333', '3366E6', '999966', '99FF99', 'B34D4D',
		  '80B300', '809900', 'E6B3B3', '6680B3', '66991A', 
		  'FF99E6', 'CCFF1A', 'FF1A66', 'E6331A', '33FFCC',
		  '66994D', 'B366CC', '4D8000', 'B33300', 'CC80CC', 
		  '66664D', '991AFF', 'E666FF', '4DB3FF', '1AB399',
		  'E666B3', '33991A', 'CC9999', 'B3B31A', '00E680', 
		  '4D8066', '809980', 'E6FF80', '1AFF33', '999933',
		  'FF3380', 'CCCC00', '66E64D', '4D80CC', '9900B3', 
		  'E64D66', '4DB380', 'FF4D4D', '99E6E6', '6666FF'];
        let random=Math.floor(Math.random()*50);
        /******************* */
            let user = await User.create({
                name: req.body.name,
                avatar:`https://ui-avatars.com/api/?name=${first}+${second}?background=${colorArray[random]}`,
                fbId: req.body.id
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            await User.findByIdAndUpdate(user.id, { $push: { tokens: { token: authtoken } } })
            res.status(200).send(authtoken);
        }
        else {
            const data = {
                user: {
                    id: fbUser._id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            await User.findByIdAndUpdate(fbUser._id, { $push: { tokens: { token: authtoken } } })
            res.status(200).send(authtoken);
        }

    } catch (error) {
        console.log("gone to error section", error);
        res.status(400).send();
    }

})

router.post('/googleLogin', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })//FIND ONE RETURNS NULL IF DOESN'T FIND ANYTHING
    if (!user) {
        /*******avatar logic */
        const [first,second]=req.body.name.split(/\s+/);
        const colorArray = ['FF6633', 'FFB399', 'FF33FF', 'FFFF99', '00B3E6', 
		  'E6B333', '3366E6', '999966', '99FF99', 'B34D4D',
		  '80B300', '809900', 'E6B3B3', '6680B3', '66991A', 
		  'FF99E6', 'CCFF1A', 'FF1A66', 'E6331A', '33FFCC',
		  '66994D', 'B366CC', '4D8000', 'B33300', 'CC80CC', 
		  '66664D', '991AFF', 'E666FF', '4DB3FF', '1AB399',
		  'E666B3', '33991A', 'CC9999', 'B3B31A', '00E680', 
		  '4D8066', '809980', 'E6FF80', '1AFF33', '999933',
		  'FF3380', 'CCCC00', '66E64D', '4D80CC', '9900B3', 
		  'E64D66', '4DB380', 'FF4D4D', '99E6E6', '6666FF'];
        let random=Math.floor(Math.random()*50);
        /******************* */
        let newUser = await User.create({
            name: req.body.name,
            avatar:`https://ui-avatars.com/api/?name=${first}+${second}?background=${colorArray[random]}`,
            email: req.body.email
        })
        const data = {
            user: {
                id: newUser._id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        await User.findByIdAndUpdate(newUser._id, { $push: { tokens: { token: authtoken } } })
        res.status(200).json(authtoken);
    } else {
        const data = {
            user: {
                id: user._id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        await User.findByIdAndUpdate(user._id, { $push: { tokens: { token: authtoken } } })
        res.status(200).json(authtoken);
    }
})
/***************************/

//authenticate a user using "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please login with valid credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please login with valid credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        await User.findByIdAndUpdate(user.id, { $push: { tokens: { token: authtoken } } })
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Getting logged in user details using POST "/api/auth/getuser"
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/verify', async (req, res) => {
    try {
        const token = req.query.token;
        const verifyToken = jwt.verify(token, JWT_SECRET);//JWT.VERIFY RETURNS DATA FROM WHICH HE HAD MADE THAT TOKEN
        // console.log(verifyToken);
        const verifiedUser = await User.findOne({ _id: verifyToken.user.id, "tokens.token": token }).select("-password")
        // .populate({ //!NOT WORKING
        //     path:'orders',
        //     populate:{
        //         path:'orderedItems',
        //         populate:{
        //             path:'productId',
        //             model:'productModel'
        //         }
        //     }
        // }) 

        if (verifiedUser) {
            // console.log(verifiedUser);
            res.status(200).json(verifiedUser);
        } else {
            res.status(404).send()
        }
    } catch (error) {
        console.error(error);
        res.status(501).send('error happened at /verify')
    }
})

router.post('/updateCart', async (req, res) => {
    // console.log(req.body);
    try {
        const userDetail = await User.findOne({ _id: req.body.id, "myCart.product._id": req.body.product._id })
        if (userDetail) {
            let Cart = userDetail.myCart;
            for (let i = 0; i < Cart.length; i++) {
                if (Cart[i].product._id === req.body.product._id) {
                    Cart[i].quantity = parseInt(Cart[i].quantity) + parseInt(req.body.quantity);
                }
            }
            await User.findByIdAndUpdate(req.body.id, { myCart: Cart })

        } else {
            await User.findByIdAndUpdate(req.body.id, { $push: { myCart: { product: req.body.product, quantity: req.body.quantity } } })
        }
        res.status(200).send();

    } catch (error) {
        res.status(400).json(error);
    }
})

router.post('/delete', async (req, res) => {
    // console.log(req.body.productId);
    let userDetail = await User.findOne({ _id: req.body.userId })

    let Cart = userDetail.myCart;
    Cart = Cart.filter(item => item.product._id !== req.body.productId)
    await User.findByIdAndUpdate(req.body.userId, { myCart: Cart })
    res.status(204).send();
})

router.post('/addOrder',async(req,res)=>{
    const {userId,orderedItems,phoneNo,streetAddress,city,zipCode,country,deliveryDate}=req.body;
    try{
        const user=await User.findById(userId);
        user.orders=[...user.orders,{
            orderedItems,
            shippingAddress:{
                phoneNo,streetAddress,city,zipCode,country
            },
            deliveryDate
        }]
        user.myCart=[];
        let updatedUser=await User.findByIdAndUpdate(userId,user,{new:true});
        res.status(201).json(updatedUser.orders);
    }catch(error){
        console.error(error);
        res.status(400).send()
    }
})


module.exports = router;
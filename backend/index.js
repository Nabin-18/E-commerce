
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { connect } = require("http2");
const paypal = require('paypal-rest-sdk');

// initilized all the modules

app.use(express.json());
app.use(cors());
// it is used to connect with express

//  now for monogodb, Data base connection

const uri =
    "mongodb+srv://Nabinkhanal:2004-03-01@cluster0.tyixfse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//body parser  or middleware to solve validation path error in mongoose

app.use(express.urlencoded({ extended: false }));

//api creation

app.get("/", (req, res) => {
    res.send("Express app is running ");
});
//Image storage engine using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

//creating upload endpoint images

app.use("/upload", express.static("upload"));


//schema for creating products
//for the database to store the data

const Product = mongoose.model("product", {
    name: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: String, required: true },
    old_price: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    id: { type: String, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
});

app.post("/addproduct", upload.single("image"), async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: `http://localhost:${port}/upload/${req.file.filename}`,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        description: req.body.description,
    });
    console.log(product);

    //to save in database

    await product.save();

    console.log("Product added successfully");
    res.json({
        success: 1,
        message: "Product added successfully",
        name: req.body.name,
    });
});

// creating api for deleting product

app.delete("/deleteproduct", async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Product deleted successfully");
    res.json({
        success: 1,
        message: "Product deleted successfully",
        id: req.body.id,
    });
});

// creating api for getting product from the database
app.get("/allproduct", async (req, res) => {
    const products = await Product.find({});
    console.log("All products fetched successfully");
    res.json(products);
});

//schema creating for user model for login signup
const User = mongoose.model("user", {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    cartData: { type: Object },
});
//schema for payment success
const Payment = mongoose.model("payment", {
    user: { type: String, required: true },
    paymentId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
});

//creating endpoint for registering the user
app.post("/signup", async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        res.json({
            success: false,
            message: "User already exists",
        });
    }
    let cart = {};
    for (let i = 0; i < 9999999999999999999999999; i++) {
        cart[i] = 0;
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id,
        },
    };
    const token = jwt.sign(data, "secret_key");
    res.json({
        success: true,
        message: "User registered successfully",
        token: token,
    });
});

//creating user login endpoint

app.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const passwordCompare = req.body.password === user.password;

        if (passwordCompare) {
            const data = {
                user: {
                    id: user.id,
                },
            };

            const token = jwt.sign(data, "secret_key");
            return res.json({
                success: true,
                message: "User logged in successfully",
                token: token,
            });
        } else {
            return res.json({
                success: false,
                message: "Wrong email or password",
            });
        }
    }
    //if user is not available
    else {
        res.json({
            success: false,
            message: "User not found",
        });
    }
});

//creating endpoint for the new collection data
app.get("/newcollection", async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    //we will get recently added 8 items
    console.log("NewCollection fetched");
    res.send(newcollection);
});
//creting endpoint for popular in women section
app.get("/popularinwoman", async (req, res) => {
    let products = await Product.find({});
    let popularinwoman = products.slice(0, 4);
    console.log("Popular in woman section fetched ");
    res.send(popularinwoman);
});

//creating middleware to fetch user

const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, "secret_key");
        const user = await User.findOne({ _id: data.user.id });
        req.user = user;
        next();
    } catch (error) {
        res.send({ error: "Please authenticate using a valid token" });
    }
}



//creating endpoint for addcart in mongodb


app.post('/addtocart', fetchUser, async (req, res) => {
    // console.log(req.body,req.user)
    console.log("added to cart", req.body.itemId)

    let userData = await User.findOne({ _id: req.user.id })
    //modfiy cart data 
    userData.cartData[req.body.itemId] ++;
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })

    res.send({
        success: true,
        message: "Item added to cart successfully"
    })


})
//creating endpoint to remove product from cartdata

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed from cart", req.body.itemId)
    let userData = await User.findOne({ _id: req.user.id })
    if (userData.cartData[req.body.itemId] > 0) {
        //modfiy cart data
        userData.cartData[req.body.itemId] -= 1;
        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
        res.send({ success: true, message: "Item removed from cart successfully" })
    }
})

//creating api to get cartdata
app.post('/getcartdata', fetchUser, async (req, res) => {
    console.log("cart data fetched");
    let userData = await User.findOne({ _id: req.user.id })
    res.json(userData.cartData);
})


// PayPal configuration
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AUTqAHlosBUbXu-sqKGtDVntdDpdEzUdXM9y1mU4cyyRv2IIXnAABr9YTT_1C7V7hDIySDw8ACbycoth',
    'client_secret': 'EDlWWgUOiJFVVkvot1d19CjkXtsD9OPJa5354wLLJAAJIe7Pz_FPG6iS4Y0RXauS0aqZTuAWlK0nmxzD'
});
app.get('/payment', async (req, res) => {

    let data
    try {

        let create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:4000/success",
                "cancel_url": "http://localhost:4000/failed"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": "100",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "100"
                },
                "description": "This is the payment description."
            }]
        };


        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                // console.log(payment);
                data = payment;
                res.json(data);

            }
        });


    } catch (error) {
        console.log(error);
    }
})



app.get('/success', async (req, res) => {

    try {

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "100"
                }
            }]
        }


        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error)
                return res.redirect("http://localhost:5173/failed");
            } else {
                console.log("Execute Payment Response");
                // console.log(payment);
                const response = JSON.stringify(payment);
                const parsedResponse = JSON.parse(response);

                const transactions = parsedResponse.transactions[0];

                console.log("transactions", transactions);

                return res.redirect("http://localhost:5173/success");
            }
        })


    } catch (error) {
        console.log(error);
    }

})


app.get('/failed', async (req, res) => {

    return res.redirect("http://localhost:5173/failed");
})


app.listen(port, (error) => {
    if (!error) {
        console.log("server running on ", port);
    } else {
        console.log("Error : " + error);
    }
});

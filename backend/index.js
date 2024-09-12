
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
const stripe = require("stripe")("sk_test_51PxtJ5RqdVllZqdP8V0okBG9oryNUGgN2zHFgd5TAnT5HK4APlQyqsaUuCY1hFcQHypVOsCPG1QF7A4agEBEnI2700PyRUkrFJ")



// initilized all the modules

app.use(express.json());
app.use(cors());
// it is used to connect with express

//  now for monogodb, Data base connection

const uri =
    "mongodb+srv://sg551666:9816156109@cluster0.tteekzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 


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

const { Schema } = require("mongoose");

const ItemSchema = new Schema({
    id: String,
    description: String,
    quantity: Number,
})

const Payment = mongoose.model("Payment", {
    user: { type: String, required: true },
    paymentId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    amount : {type: Number, required: true},
    currency: {type: String, required: true},
    items : [ItemSchema],
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
    for (let i = 0; i < 300; i++) {
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
app.get('/getcartdata', fetchUser, async (req, res) => {
    try {
        console.log("cart data fetched");
        let userData = await User.findOne({ _id: req.user.id });
        res.json(userData.cartData);
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});
// app.get('/getcartdata', fetchUser, async (req, res) => {
//     console.log("cart data fetched");
//     let userData = await User.findOne({ _id: req.user.id })
//     res.json(userData.cartData);
// })
//commit check
//checkout api
app.post("/api/create-checkout-session", async (req, res) =>{
    const {products} = req.body;

    const lineItems = products.map((product)=>({
        price_data:{
            currency: "usd",
            product_data:{
                name: product.name,
            },
            unit_amount: product.new_price * 100,
        },
        quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items:lineItems,
        mode: "payment",
        success_url: "http://localhost:4000/success?session_id={CHECKOUT_SESSION_ID}&order=${encodeURI(JSON.stringify(products))}",
        cancel_url: "http://localhost:5173/cancel",
    });

    res.json({id: session.id})
});

// Payment success API
app.get('/success', async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const [session, lineItems] = await Promise.all([
            stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] }),
            stripe.checkout.sessions.listLineItems(sessionId)
        ]);

        console.log('Session:', session); // Log the session object
        console.log('Line Items:', lineItems.data); // Log the line items data

        const paymentIntent = session.payment_intent;
        console.log('Payment Intent:', paymentIntent); // Log the payment intent object

        if (!paymentIntent) {
            throw new Error('Payment intent not found');
        }

        if (!lineItems.data || lineItems.data.length === 0) {
            throw new Error('Line items not found or empty');
        }

        // Prepare payment details
        const lineItemsArray = lineItems.data.map((item) => ({
            // id: item.price.product_data.name,
            description: item.description,   //product name
            quantity: item.quantity
        }));

        const paymentData = {
            user: sessionId, // Use session ID as the user identifier
            paymentId: paymentIntent.id,
            amount: session.amount_total / 100, // Convert amount to dollars
            currency: session.currency,
            items: lineItemsArray
        };

        console.log('Payment Data:', paymentData); // Log the payment data

        // Save payment details to the database
        const payment = new Payment(paymentData);

        try {
            await payment.save();
            console.log('Payment details saved:', payment);
            res.send("Payment Success");
        } catch (error) {
            console.error('Error saving payment details:', error);
            res.status(500).send('Error saving payment details');
        }

    } catch (error) {
        console.error('Error retrieving payment details:', error);
        res.status(500).send('Error retrieving payment details');
    }
});

    app.get('/cancel', (req, res) => { 
        res.redirect('/')
    })

app.listen(port, (error) => {
    if (!error) {
        console.log("server running on ", port);
    } else {
        console.log("Error : " + error);
    }
});


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
const bcrypt = require('bcrypt');
const stripe = require("stripe")("sk_test_51PxtJ5RqdVllZqdP8V0okBG9oryNUGgN2zHFgd5TAnT5HK4APlQyqsaUuCY1hFcQHypVOsCPG1QF7A4agEBEnI2700PyRUkrFJ")



// initilized all the modules

app.use(express.json());
app.use(cors());
// it is used to connect with express

//  now for monogodb, Data base connection

const uri =
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1";


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
        let last_product = products[products.length - 1]; // Get the last product directly
        id = parseInt(last_product.id, 10) + 1; // Convert the string to an integer before incrementing
    } else {
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
let initialCartData = {};
    for (let i = 0; i < 300; i++) {
        initialCartData[i] = 0;
    }
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
    ph_no: { type: String, required: true },
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
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    ph_num: { type: String, required: true },
    items: [ItemSchema],
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
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        ph_no: req.body.ph_no,
        password: hashedPassword,
        cartData: initialCartData,
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
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            // Compare the plain text password with the hashed password
            const passwordCompare = await bcrypt.compare(req.body.password, user.password);

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
        } else {
            // If user is not available
            return res.json({
                success: false,
                message: "User not found",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
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
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, "secret_key");
        const user = await User.findOne({ _id: data.user.id });
        if (!user) {
            return res.status(401).send({ error: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

const fetchUserFromQuery = async (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, "secret_key");
        const user = await User.findOne({ _id: data.user.id });
        const ph_no = user.ph_no;
        req.user = user;
        req.ph_no = ph_no;
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
        success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:5173/cancel",
    });

    res.json({id: session.id})
});

// Payment success API
app.get('/success',fetchUserFromQuery, async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const [session, lineItems] = await Promise.all([
            stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] }),
            stripe.checkout.sessions.listLineItems(sessionId)
        ]);
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
            description: item.description,   //product name
            quantity: item.quantity
        }));

        const paymentData = {
            user: req.user.name,
            ph_num: req.ph_no,
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

            res.json({ success: true });

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

//get the payment data from database 
app.get('/getpaymentdata', async (req, res) => {
    try {
        const paymentData = await Payment.find({});
        res.json(paymentData);
    } catch (error) {
        console.error('Error fetching payment data:', error);
        res.status(500).send('Error fetching payment data');
    }
});



app.post('/clearcart', fetchUser, async (req, res) => {
    try {
        await
            User.findOneAndUpdate({ _id: req.user.id }, { cartData: initialCartData });
        res.send({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}
);

app.listen(port, (error) => {
    if (!error) {
        console.log("server running on ", port);
    } else {
        console.log("Error : " + error);
    }
});

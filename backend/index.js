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

// initilized all the modules

app.use(express.json());
app.use(cors());
// it is used to connectwith express

//  now for monogodb, Data base connection

const uri =
    "mongodb+srv://Nabinkhanal:2004-03-01@cluster0.tyixfse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// mongoose.connect(uri);
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
    const productId = uuidv4();
    const product = new Product({
        id: productId,
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
//creating endpoint for addcart in mongodv


app.listen(port, (error) => {
    if (!error) {
        console.log("server running on ", port);
    } else {
        console.log("Error : " + error);
    }
});

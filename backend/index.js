const port = 4000;
const express = require('express');
const app = express();
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const multer = require("multer")
const path = require("path")
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const { connect } = require('http2');
// const bodyParser = require("body-parser")
// initilized all the modules 

app.use(express.json());
app.use(cors());
// it is used to connectwith express 

//  now for monogodb, Data base connection

const uri = ("mongodb+srv://Nabinkhanal:2004-03-01@cluster0.tyixfse.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

mongoose.connect(uri);

//body parser  or middleware to solve validation path error in mongoose


app.use(express.urlencoded({ extended: false }));


//api creation

app.get("/", (req, res) => {
    res.send("Express app is running ")
})
//Image storage engine using multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

//creating upload endpoint images

// app.use('/images', express.static('upload/images'))

// app.post("/upload", upload.single('product'), (req, res) => {
//     res.json({
//         success: 1,
//         image_url: `http:localhost:${port}/image/${req.file.filename}`
//     })
// })

app.post('/upload', upload.single('file'), (req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
});

app.get('/upload', (req, res) => {
    res.send(`
    <h2>File Upload using Multer</h2>
    <form action="/upload" enctype="multipart/form-data" method="POST">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});



//schema for creating products 
//for the database to store the data

const Product = mongoose.model("product", {
    "name": { type: String, required: true },
    "category": { type: String, required: true },
    "new_price": { type: String, required: true },
    "old_price": { type: String, required: true },
    "description": { type: String, required: true },
    "image": { type: String, required: true },
    "id": { type: String, required: true },
    "date": { type: Date, default: Date.now },
    "available": { type: Boolean, default: true }


})


app.post("/addproduct", async (req, res) => {

    const productId = uuidv4();
    const product = new Product({
        id: productId,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        description: req.body.description
    });
    console.log(product);

    //to save in database

    await product.save();

    console.log("Product added successfully");
    res.json({
        success: 1,
        message: "Product added successfully",
        name: req.body.name
    })


})


// creating api for deleting product

app.post("/deleteproduct", async (req, res) => {

    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Product deleted successfully");
    res.json({
        success: 1,
        message: "Product deleted successfully",
        id: req.body.id

    })
});


//creating api for getting product from the database 

app.get("/allproduct", async (req, res) => {
    const products = await Product.find({});
    console.log("All products fetched successfully");
    res.json(products);



})




app.listen(port, (error) => {
    if (!error) {
        console.log("server running on ", port);
    }
    else {
        console.log("Error : " + error)
    }
})
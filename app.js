const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const path = require("path");
const router = require('./routes/feed');
const multer = require("multer");
const app = express();
const fileStorage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'images')
    },
    filename: (re,file,cb) =>{
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
const fileFilter = (re,file,cb) =>{
    if(
        file.mimetype === 'image/png'||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    }
    else{
        cb(null, false)
    }
};
  
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname,'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes)

app.use((error, req, res, next) =>{
    const data = error.data;
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message, data: data})
})
mongoose.connect('mongodb+srv://dardan:dardan@cluster0.6yiwy8g.mongodb.net/messages').then(result =>{
    app.listen(3002)
}).catch(err => console.log(err));
router.get("/post/:postId");
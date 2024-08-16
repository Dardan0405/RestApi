const express = require('express');
const fs = require("fs")
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require("path");
const router = require('./routes/feed');
const multer = require("multer");
const graphql = require("express-graphql");
const graphqlSchema = require("./graphql/schema")
const graphqlReslover = require("./graphql/resolvers");
const { formatError } = require('graphql');
const { measureMemory } = require('vm');
const auth = require('./middleware/auth')
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")

const { clear } = require('console');
const {clearImage} = require("./util/file");
const { default: helmet } = require('helmet');
const MONGODB_URI =
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.6yiwy8g.mongodb.net/${MONGO_DATABASE}`
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
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200)
    }
    next();
});
app.use(auth);
app.put('/post-image',(req,res,nect) =>{
    if(req.isAuth){
        throw new Error("Not Auth")
    }
    if(!req.file){
        return res.status(200).json({message: 'No file provided'})
    }
    if(req.body.oldPath){
        clearImage(req.body.oldPath);

    }
    return res.status(201).json({message: 'File Stored', filePath: req.file.path})

});

app.use('/graphql', graphql({
    schema: graphqlSchema,
    rootValue: graphqlReslover,
    graphql: true,
    formatError(err){
        if (!err.originalError){
            return err;
        }
     const data = err.originalError.data;
     const message = err.message || "An error ocurred";
     const code = err.originalError.code || 500;
     return{message: message, status: code, data: data}
    }
}
))



app.use((error, req, res, next) =>{
    const data = error.data;
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message, data: data})
})
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), 
{flags: 'a'}
);
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream: accessLogStream}));

mongoose.connect(MONGODB_URI)
.then(result =>{
    app.listen(process.env.PORT || 3000)
}).catch(err => console.log(err))

const express = require('express');
const path = require('path');
const dirname = require('./utils/pathutils');
const multer = require('multer');

const userrouter = require('./routers/userrouter');
const hostrouter = require('./routers/hostrouter');
const authrouter = require('./routers/authrouter');
// const {mongoConnect} = require('./utils/dbutil');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

const app = express();
const PORT = 3000;
const URL = "mongodb+srv://pavan:pavan@cars.witw2lu.mongodb.net/carbnb?retryWrites=true&w=majority&appName=cars";

const storage = multer.diskStorage({
    destination : (req,res,cb) => {
        cb(null,'uploads/')
    },
    filename : (req,file,cb) => {
        cb(null,Math.random() + "-" + file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if([file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg']){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}

const multerOptions = {
    storage,
    fileFilter
}

const store = new mongoStore({
    uri : URL,
    collection : 'sessions'
})


app.use(express.urlencoded({extended : true}));
app.use(multer(multerOptions).single('image'));
app.use('/uploads',express.static(path.join(dirname,'uploads')));

app.use(session({
    secret : "pavans secret",
    resave : false,
    saveUninitialized : true,
    store : store
}))

app.use(express.static(path.join(dirname,'public')));
app.set('view engine','ejs');
app.set('views','views');

// app.use((req,res,next) =>{
//     console.log("checking cookie middleware",req.get('Cookie'));
//     req.isLoggedIn = req.get('Cookie') ? req.get('Cookie').split('=')[1] === 'true' : false;
//     next();
// })

app.use((req,res,next) =>{
    req.isLoggedIn = req.session.isLoggedIn;
    next();
})

app.use(userrouter);
app.use(hostrouter);
app.use(authrouter);

// mongoConnect(() => {
//     // console.log(client);
//     app.listen(PORT,() => {
//     console.log(`app is listening on http://localhost:${PORT}`);
// })
// }
// )

mongoose.connect(URL).then(() => {
    console.log("mongoose connected");
    app.listen(PORT,() => {
    console.log(`app is listening on http://localhost:${PORT}`);
})
})
.catch((err) => console.log(err));
const dotenv = require('dotenv');

dotenv.config();

const express=require('express');
const mongoose=require('mongoose');
const path=require('path')
const ejsMate=require('ejs-mate')
// const Joi=require('joi')
// const {campgroundSchema,reviewSchema}=require('./schemas')
const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override')
const session=require('express-session')
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local')
const User=require('./models/user')

var bodyParser = require('body-parser');



const userRoutes=require('./routes/users')
const campgroundRoutes=require('./routes/campgrounds')
const reviewRoutes=require('./routes/reviews');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlparser:true,
    // useCreateIndex:true,
    // uneUnifiedTopology:true
})
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("database connected")
})

const app=express();
app.use(express.static(path.join(__dirname,'public')))
 app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extented:true}))
app.use(methodOverride('_method'))

app.use(bodyParser.json());

const sessionConfig={
    secret:"Thisshouldbesecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    
   res.locals.currentuser=req.user; 
  res.locals.success= req.flash('success');
  res.locals.error=req.flash('error')
  next()
})

// const validateCampground=(req,res,next)=>{
  
//         const {error}=campgroundSchema.validate(req.body);
         
//         if(error){
//             const msg=error.details.map(el=>el.message).join(",")
//             throw new ExpressError(msg,400)
//         }else{
//             next();
//         }
    
// }

// const validateReview=(req,res,next)=>{
//     const error=reviewSchema.validate(req.body);
   
//     if(error){
//         const msg=error.details.map(el=>el.message).join(",")
//         throw new ExpressError(msg,400)
//     }else{
//         next();
//     }

// }


app.get('/',(req,res)=>{
    res.render('home')
})

app.use('/',userRoutes)

app.use('/campgrounds',campgroundRoutes)

app.use('/campgrounds/:id/reviews',reviewRoutes)



app.all('*',(req,res,next)=>{
 next(new ExpressError("page not found",404))
 //res.send("404!!")
})


app.use((err,req,res,next)=>{
   const {statusCode=500,message="something wrong"}=err;
   if(!err.message) err.message="sorry!There are some problem."
   res.status(statusCode).render('error',{err})
   // res.send("oh boy!went wrong")
})

app.listen(3000,(req,res)=>{
    console.log("server running")
})
const mongoose=require('mongoose');
const cities=require('./cities')
const {places,descriptors}=require('./seedHelpers')
const Campground=require('../models/campground')

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

const sample=(array)=>array[Math.floor(Math.random()*array.length)]


const seedDB=async()=>{
    await Campground.deleteMany();
  for(let i=0;i<50;i++){
       const random1000=Math.floor(Math.random()*1000);
       const price=Math.floor(Math.random()*20)+10;
       const camp = new Campground({
        author:"652b7b0c6802b04964e2856c",
     location:`${cities[random1000].city},${cities[random1000].state}`,
    title:`${sample(descriptors)} ${sample(places)}`,
    description:' Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vitae rerum quisquam harum nemo velit vero libero nihil inventore reiciendis molestiae placeat voluptatibus facere labore, quaerat fugiat cum quis quide',
    price:price,
    images:[
        {
          url: 'https://res.cloudinary.com/ddqduc7jn/image/upload/v1697621566/YelpCamp/ojwmqwdhgqcsirfbfbcq.jpg',
          filename: 'YelpCamp/ojwmqwdhgqcsirfbfbcq'
        }
      ]
       })
       await camp.save();
  }
}

seedDB().then(()=>{
    mongoose.connection.close();
})
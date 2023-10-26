const express=require('express');
const catchAsync=require('../utils/catchAsync');
const Campground=require('../models/campground');
const Review=require('../models/review');
const {reviewSchema}=require('../schemas.js')
const router=express.Router({mergeParams:true});
const {isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')


router.post('/',isLoggedIn,catchAsync(reviews.createReview))
 
 router.delete('/:reviewID',isLoggedIn,catchAsync(reviews.deleteReview))
 

 module.exports=router;
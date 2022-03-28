const reviewModel = require('../model/reviewModel');
const bookModel = require("../model/bookModel");
const mongoose = require('mongoose')
// ## Review APIs:

// (1)### POST /books/:bookId/review:
const isValidObjectId = function (ObjectId) {return mongoose.Types.ObjectId.isValid(ObjectId)}
const review = async function(req,res){
    try{
        let bookid = req.params.bookId;
        if(!isValidObjectId(bookid)){ return res.status(400).send({ status: false, msg: "sorry the bookId is invalid" }) };
        let bookPresent = await bookModel.findById(bookid);
        if(!bookPresent){ return res.status(400).send({ status: false, msg: "Sorry This bookId Is Not Present" }) };
        let data = req.body;
        let {bookId,rating} = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "PLEASE FILL THE BODY" });
        // VALIDATING BOOKID:
        if (!bookId) return res.status(400).send({ status: false, msg: "Where is the bookId ?" });
        let bookidPresent = await bookModel.findById(bookId)
        if (!bookidPresent) { return res.status(400).send({ status: false, msg: "Sorry This bookId Is Not Present" }) };
        // VALIDATING RATING:
        if (!rating) return res.status(400).send({ status: false, msg: "Where is the rating ?" });
        if(rating<1) return res.status(400).send({status:false , msg:" Rating must be greater than 1"});
        if(rating>5) return res.status(400).send({status:false , msg:" Rating must be less than 5"});
        // VALIDATING REVIEWEDAT:
        data.reviewedAt = Date.now();
        //  UPDATING THE REVIEW OF THE BOOK:
        let updateReview = await bookModel.findByIdAndUpdate({ _id: bookId , isDeleted: false },{$inc:{reviews:1}},{new:true});
        // CREATING REVIEW WITH THE HELP OF DATA IN THE REQUEST BODY:
        let CreateReview = await reviewModel.create(data)
          res.status(201).send({status:true,data:CreateReview});
    }catch(err){
        res.status(500).send({status:false ,Error:err.message});
    }}
    module.exports.review = review;
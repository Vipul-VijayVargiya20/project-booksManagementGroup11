const reviewModel = require('../model/reviewModel');
const bookModel = require("../model/bookModel");
const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) {return mongoose.Types.ObjectId.isValid(ObjectId)}
const isValid = function (value){if (typeof (value) === "string" && (value).trim().length === 0) { return false }return true}
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
          res.status(201).send({status:true,total:data.length,data:CreateReview});
    }catch(err){
        res.status(500).send({status:false ,Error:err.message});
    }}
///////////////////////////////// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const updateReview = async function(req,res){
    try{
        let requestParams = req.params
        const { bookId, reviewId } = requestParams
        if(!isValidObjectId(bookId)){ return res.status(400).send({ status: false, msg: "sorry the bookId is invalid" }) };
        if(!isValidObjectId(reviewId)){ return res.status(400).send({ status: false, msg: "sorry the reviewId is invalid" })};
        let requestBody = req.body
        const { review, rating, reviewedBy } = requestBody
        if (!isValid(review)||(!isValid(rating)||(!isValid(reviewedBy))))return res.status(400).send({ status: false, msg: "please dont put empty value in the body ?" });
        if(rating<1) return res.status(400).send({status:false , msg:" Rating must be greater than 1"});
        if(rating>5) return res.status(400).send({status:false , msg:" Rating must be less than 5"});
        const updateData = await bookModel.findById(bookId)
        if(!updateData)return res.status(400).send({ status: false, msg:"bookId is not present"})
        if (updateData.isDeleted==true)return res.status(400).send({ status: false, msg:"sorry the book you want to update is deleted!"})
        const reviewUpdate = await reviewModel.findById(reviewId)
        if(!reviewUpdate)return res.status(400).send({ status: false, msg:"reviewId is not present"})
        if (reviewUpdate.isDeleted==true)return res.status(400).send({ status: false, msg:"sorry the review you want to update is deleted!"})
        const updateResult = await reviewModel.findByIdAndUpdate(reviewId,requestBody,{ new: true });
        if(reviewUpdate.bookId != bookId){return res.status(400).send({ status: false, msg:"bookId is not matching with the bookId in the review"})}
        let data = JSON.parse(JSON.stringify(updateData)) // DEEP CLONNING 
        data.updatedResult = [updateResult]
        res.status(200).send({ status: true,total:requestBody.length,msg:"updated data", data:data })
        } catch (err) {return res.status(500).send({ status: false, message: err.message })}
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Deletereview= async  function(req,res){
    try{
        let requestParams = req.params
        const {bookId,reviewId} = requestParams
        if(!isValidObjectId(bookId)){ return res.status(400).send({ status: false, msg: "sorry the bookId is invalid" }) };
        if(!isValidObjectId(reviewId)){ return res.status(400).send({ status: false, msg: "sorry the reviewId is invalid" })};
        const updateData = await bookModel.findById(bookId)
        if(!updateData)return res.status(400).send({ status: false, msg:"bookId is not present"})
        if (updateData.isDeleted==true)return res.status(400).send({ status: false, msg:"sorry the book you want to delete is already deleted!"})
        const reviewUpdate = await reviewModel.findById(reviewId)
        if(!reviewUpdate)return res.status(400).send({ status: false, msg:"reviewId is not present"})
        if (reviewUpdate.isDeleted==true)return res.status(400).send({ status: false, msg:"sorry the review you want to delete is already deleted!"})
        const updateDelete = await reviewModel.findOneAndUpdate({_id:reviewId},{$set:{isDeleted:true}},{ new: true });
        await bookModel.findByIdAndUpdate({ _id: bookId , isDeleted: false },{$inc:{reviews:-1}},{new:true})
        if(reviewUpdate.bookId != bookId){return res.status(400).send({ status: false, msg:"bookId is not matching with the bookId in the review"})}
        res.status(200).send({status:true,msg:"review is deleted",data:updateDelete})
       } catch (err) {return res.status(500).send({ status: false, message: err.message })}
    }




module.exports.review = review;
module.exports.updateReview= updateReview
module.exports.Deletereview= Deletereview
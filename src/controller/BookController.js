const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const reviewModel = require("../model/reviewModel")
const ObjectId = require("mongoose").Types.ObjectId

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const createBook = async function (req, res) {
try {
    const data = req.body
    const { title, category, subcategory, ISBN, excerpt, reviews, ReleasedAt } = data
  if (Object.keys(data) == 0) return res.status(400).send({ status: false, messag: "please provide data" })
const user_Id = data.userId
let validUser = await userModel.findById(user_Id)

if (!isValid(user_Id)) { return res.status(400).send({ status: false, msg: "user Id is required" }) }
if (!ObjectId.isValid(validUser)) { return res.status(400).send({ status: false, msg: "Please provide a valid user Id" }) }

if (Object.keys(data) == 0) return res.status(400).send({ status: false, ERROR: "No data provided" })

if (!isValid(title)) { return res.status(400).send({ status: false, msg: "title name is required" }) }

let duplicateTitle = await bookModel.findOne({ title });
if (duplicateTitle) {
return res.status(400).send({ status: false, message: "Title is already in use" })
  }
if (!isValid(excerpt)) { return res.status(400).send({ status: false, msg: "excerpt is required" }) }
if (!isValid(ISBN)) { return res.status(400).send({ status: false, msg: "isbn is required" }) }
//if (!/\b(?:ISBN(?:: ?| ))?((?:97[89])?\d{9}[\dx])\b/.test(data.ISBN)) return res.status(400).send({ status: false, msg: "ISBN is not valid"})
let duplicateISBN = await bookModel.findOne({ ISBN });
if (duplicateISBN) {
return res.status(400).send({ status: false, message: "ISBN is already in use" })
}
if (!isValid(category)) { return res.status(400).send({ status: false, msg: "category is required" }) }
if (!isValid(subcategory)) { return res.status(400).send({ status: false, msg: "subcategory is required" }) }
if (!isValid(reviews)) { return res.status(400).send({ status: false, msg: "reviews is required" }) }
if (!isValid(ReleasedAt)) { return res.status(400).send({ status: false, msg: "releasedAt is required" }) }
if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(ReleasedAt)) {
return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
}
let savedData = await bookModel.create(data);
return res.status(201).send({ status: true, data: savedData, msg: "successfull" });
} catch (err) {

return res.status(500).send({ status: false, ERROR: err.message })

}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getBooksbyQuery = async function (req, res) {
  try{
    const query = req.query
    const filter ={
      ...query,
      isDeleted : false
    } // store conditions in filter variable
const findBooks = await bookModel.find(filter).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})
if(findBooks.length === 0){
return res.status(404).send({status:true, message:"no books found."})}
res.status(200).send({status:true, message:"books list",data:findBooks}) 
} 
catch (err) {
return res.status(500).send({ status: true, ERROR: err.message })
 
}
}
//////////////////////////////////////////////////////////////////////////////////////////
const bookDetails = async function (req, res) {
  try {
let bookId = req.params.bookId;
if (!bookId) {return res.status(400).send({ msg: "please input book ID." })}
let bookDetails = await bookModel.findById(bookId);
if (!bookDetails)return res.status(404).send({ status: false, msg: "No such book exists" });
let data = JSON.parse(JSON.stringify(bookDetails)) // DEEP CLONNING 
const book_id = bookDetails._id
let reviews = await reviewModel.find({bookId:book_id}).select({_id:true,bookId:true,reviewedBy:true,reviewedAt:true,rating:true,review:true})
if(bookDetails.isDeleted==true)return res.status(404).send({ status: false, msg: "Book is already deleted" });
data={_id:bookDetails._id,title:bookDetails.title,excerpt:bookDetails.excerpt,userId:bookDetails.userId,category:bookDetails.category,subcategory:bookDetails.subcategory,isDeleted:bookDetails.isDeleted,reviews:bookDetails.reviews,releasedAT:bookDetails.releasedAT,createdAt:bookDetails.createdAt,updatedAt:bookDetails.updatedAt}
data.reviewsData = [...reviews]
 res.status(200).send({status:true,msg:"book list",data:data});
  }catch (err) {
      console.log("This is the error.", err.message)
      res.status(500).send({ msg: "error", error: err.message })
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateBooks = async function (req, res)  {
try {
let Id = req.params.bookId
let books = await bookModel.findById(Id)
if (!isValid(books)){
return res.status(404).send({status:false, msg : "Books not found"})
}
if (books.isDeleted == false) {

let newTitle = req.body.title
let newExcerpt = req.body.excerpt
let newISBN = req.body.ISBN
let newCategory = req.body.Category
let newSubCategory = req.body.subcategory
let newReview = req.body.review
let newReleasedAt = req.body.releasedAt

let updatedBook = await bookModel.findByIdAndUpdate({ _id:Id },
{
$set: { title: newTitle, excerpt: newExcerpt,  ISBN:newISBN, releasedAt:newReleasedAt },
$push: { review: newReview, category: newCategory, subcategory: newSubCategory }
},
{ new: true })
console.log(updatedBook)
return res.status(200).send({ Status: true, data: updatedBook })
}
} catch (error) {
  res.status(500).send({ status: false, msg: error.message })
}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const deleteById = async (req, res) => {

  try {
let Id = req.params.bookId
let ifExists = await bookModel.findById(Id)
if (!ifExists) {
          return res.status(404).send({ Status: false, msg: "Data Not Found" })
     }
if (ifExists.isDeleted !== true) {
let deleteBook = await bookModel.findByIdAndUpdate({ _id: Id }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
   return res.status(200).send()
} else {
  return res.status(400).send({ status: false, msg: "already deleted" })
  }
} catch (error) {
   res.status(500).send({ Err: error.message })
  }


}

module.exports.createBook =createBook ;
module.exports.getBooksbyQuery=getBooksbyQuery
module.exports.updateBooks=updateBooks
module.exports.deleteById=deleteById
module.exports.bookDetails=bookDetails
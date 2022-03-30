const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const reviewModel = require("../model/reviewModel")
const validate = require('../validator/validators')

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
  
    return true ;
}
const createBook = async (req, res) => {
try {
        let bookData = req.body
        if (!validate.isValidRequestBody(bookData)) {
            return res.status(400).send({ status: false, message: "Invalid Parameters" })
        }
       let { title, excerpt, userId, ISBN, category, subcategory, reviews, ReleasedAt } = req.body

        
        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, message: "title Is Required" })
        }
        const duplicateTitle = await bookModel.findOne({ title: req.body.title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "title is already present" })
        }
        if (!validate.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Excerpt Is Requird" })
        }
        if (!validate.isValid(userId)) {
            return res.status(400).send({ status: false, message: "User Id required!" })
        }
        if (!validate.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid User Id!" })
        }
        const ifUserExist = await userModel.findById(userId)
        if (!ifUserExist) {
            return res.status(404).send({ status: false, message: "User Not Found, Please Check User Id" })
        }
        if (!validate.isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Invalid ISBN Enterd" })
        }
        const duplicateISBN = await bookModel.findOne({ ISBN: req.body.ISBN })
        if (duplicateISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already present" })
        }
        if (!validate.isValid(category)) {
            return res.status(400).send({ status: false, message: "Category Is Required" })
        }
        if (!validate.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory Is Required" })
        }
        if (reviews) {
            if (typeof reviews !== 'number') {
                return res.status(400).send({ status: false, message: " Reviews - Unexpected Input" })
            }
        }
        if (!validate.isValidReleasedAt(ReleasedAt)) {
            return res.status(400).send({ status: false, message:  "YYYY-MM-DD" })
        }
        if (req.body.isDeleted === true) {
            return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
        }
        const newBook = await bookModel.create(bookData)
        return res.status(201).send({ status: true, message: "Success", Data: newBook })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getBooksbyQuery = async function (req, res) {
  try{
    const query = req.query
    if (Object.keys(query).length === 0) {
        return res.status(400).send({ status: false, msg: "no book found" })}
    const filter ={
      ...query,
      isDeleted : false
    }// store conditions in filter variable
const findBooks = await bookModel.find(filter).select({title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})

if(findBooks.length === 0){
return res.status(404).send({status:true, message:"no books found."})}
res.status(200).send({status:true,total:findBooks.length, message:"books list",data:findBooks}) 
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
 res.status(200).send({status:true,total:reviews.length,msg:"book list",data:data});
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
let newReleasedAt = req.body.ReleasedAt
if (!isValid(newTitle)||(!isValid(newISBN)||(!isValid(newExcerpt))))return res.status(400).send({ status: false, msg: "please dont put empty value in the body ?" });
let updatedBook = await bookModel.findByIdAndUpdate({ _id:Id },
{
$set: { title: newTitle, excerpt: newExcerpt,  ISBN:newISBN, ReleasedAt:newReleasedAt },
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
   return res.status(200).send({status : true, msg: "data deleted sucessfully"})
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
const bookModel = require("../model/bookModel")
const userModel = require("../model/userModel")
const reviewModel = require("../model/reviewModel")
const validate = require('../validator/validators')


const createBook = async (req, res) => {
    try {
        let bookData = req.body
        if (!validate.isValidRequestBody(bookData)) {
            return res.status(400).send({ status: false, message: "Invalid parameters" })
        }
        let { title,bookCover, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = req.body
        if (!validate.isValid(userId)) {
            return res.status(400).send({ status: false, message: "User Id required!" })
        }
        if (!validate.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user Id!" })
        }
        const userExist = await userModel.findById(userId)
        if (!userExist) {
            return res.status(404).send({ status: false, message: "User not found, Please check user Id" })
        }
        // if (userId.toString() !== req.loggedInUser) {
        //     return res.status(403).send({ satus: false, message: `Unauthorized access! Owner info doesn't match` })
        // }
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
        if (!validate.isValidISBN(ISBN.trim())) {
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
        if (!validate.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "ReleasedAt is required" })
        }
        if (!validate.isValidReleasedAt(releasedAt.trim())) {
            return res.status(400).send({ status: false, message: "Please enter date in YYYY-MM-DD" })
        }
        if (req.body.isDeleted === true) {
            return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
        }

        const finalData = {
            bookCover,
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            reviews,
            releasedAt: releasedAt ? releasedAt: "releasedAt is required",
        };



        const newBook = await bookModel.create(finalData)
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
let updateBooks = async function (req, res) {
    try {
        let book_id = req.params.bookId
        if (!validate.isValidObjectId(book_id)) {
            return res.status(400).send({ status: false, message: "Please enter a valid book Id" })
        }
        if (!validate.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Please enter data to update" })
        }
        let validBook = await bookModel.findOne({ _id: book_id, isDeleted: false })
        if (!validBook)
            return res.status(404).send({ status: false, message: "No book found" })

        if (validBook.userId.toString() !== req.loggedInUser) {
            return res.status(403).send({ satus: false, message: `Unauthorized access! Owner info doesn't match` })
        }
        let bookKeys = ["title", "excerpt", "releasedAt", "ISBN"]
        for (let i = 0; i < Object.keys(req.body).length; i++) {
            let keyPresent = bookKeys.includes(Object.keys(req.body)[i])
            if (!keyPresent)
                return res.status(400).send({ status: false, message: "Wrong Key present" })
        }
        if (Object.keys(req.body).includes('title')) {
            if (!validate.isValid(req.body.title)) {
                return res.status(400).send({ status: false, message: "Title Is Required" })
            }
            const duplicateTitle = await bookModel.findOne({ title: req.body.title })
            if (duplicateTitle)
                return res.status(400).send({ status: false, message: "Title is already present" })
        }
        if (Object.keys(req.body).includes('excerpt')) {
            if (!validate.isValid(req.body.excerpt)) {
                return res.status(400).send({ status: false, message: "Excerpt is not valid" })
            }
        }
        if (Object.keys(req.body).includes('ISBN')) {
            if (!validate.isValidISBN(req.body.ISBN.trim())) {
                return res.status(400).send({ status: false, message: "Invalid ISBN Enterd" })
            }
            const duplicateISBN = await bookModel.findOne({ title: req.body.ISBN })
            if (duplicateISBN)
                return res.status(400).send({ status: false, message: "ISBN is already present" })
        }
        if (Object.keys(req.body).includes('releasedAt')) {
            if (!validate.isValidReleasedAt(req.body.releasedAt.trim())) {
                return res.status(400).send({ status: false, message: " Please enter date in YYYY-MM-DD" })
            }
        }
        let updatedBook = await bookModel.findOneAndUpdate(
            { _id: book_id, isDeleted: false },
            { $set: req.body },
            { new: true });

        return res.status(200).send({ status: true, message: "success", data: updatedBook });
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
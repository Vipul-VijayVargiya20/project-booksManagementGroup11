const express = require('express');
const router = express.Router();
const userController=require("../controller/UserController")
const bookController=require("../controller/BookController")
const reviewController=require("../controller/ReviewController")
const Middleware=require("../middleware/authenticationAndAuthorisation")

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// user api
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
// book api
router.post("/books",Middleware.authenticationUser,Middleware.authorisationUser,bookController.createBook)
router.get("/books",Middleware.authenticationUser,bookController.getBooksbyQuery)
router.delete("/books/:bookId",Middleware.authenticationUser,Middleware.bookAuthorise,bookController.deleteById)
router.put("/books/:bookId" ,Middleware.authenticationUser,Middleware.bookAuthorise,bookController.updateBooks)
router.get("/books/:bookId",Middleware.authenticationUser,Middleware.bookAuthorise,bookController.bookDetails)
// reviews api
router.post("/books/:bookId/review",reviewController.review)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;

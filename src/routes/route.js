const express = require('express');
const router = express.Router();
const userController=require("../controller/UserController")
const bookController=require("../controller/BookController")
const reviewController=require("../controller/ReviewController")
const Middleware=require("../middleware/authenticationAndAuthorisation")

//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",Middleware.authenticationUser,Middleware.authorisationUser,bookController.createBook)
router.get("/books",Middleware.authenticationUser,bookController.getBooksbyQuery)
router.delete("/books/:bookId",Middleware.authenticationUser,Middleware.bookAuthorise,bookController.deleteById)
router.put("/books/:bookId" ,Middleware.authenticationUser,Middleware.bookAuthorise,bookController.updateBooks)
router.get("/books/:bookId",Middleware.authenticationUser,Middleware.bookAuthorise,bookController.bookDetails)
router.post("/books/:bookId/review",reviewController.review)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.Deletereview)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;

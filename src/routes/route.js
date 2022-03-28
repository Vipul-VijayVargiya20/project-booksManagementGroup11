const express = require('express');
const router = express.Router();
const userController=require("../controller/UserController")
const bookController=require("../controller/BookController")
const reviewController=require("../controller/ReviewController")


//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getBooksbyQuery)
router.delete("/books/:bookId",bookController.deleteById)
router.put("/books/:bookId" ,bookController.updateBooks)
router.get("/books/:bookId",bookController.bookDetails)
router.post("/books/:bookId/review",reviewController.review)
// router.put("/books/:bookId/review/:reviewId")
// router.delete("/books/:bookId/review/:reviewId")


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;

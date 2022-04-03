const express = require('express');
const router = express.Router();
const userController=require("../controller/UserController")
const bookController=require("../controller/BookController")
const reviewController=require("../controller/ReviewController")
const Middleware=require("../middleware/authenticationAndAuthorisation")

const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: "AKIAY3L35MCRVFM24Q7U",  // id
  secretAccessKey: "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",  // secret password
  region: "ap-south-1" 
});



let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) { 
    
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    var uploadParams = {
      ACL: "public-read", 
      Bucket: "classroom-training-bucket", 
      Key: "vipul/" + file.originalname,    
      Body: file.buffer, 
    };

    s3.upload(uploadParams , function (err, data) {
      if (err) {
        return reject( { "error": err });
      }
   
      return resolve(data.Location);  
    });
  });
};

router.post("/write-file-aws", async function (req, res) {
  try {
    let files = req.files;
    if (files && files.length > 0) {
      let uploadedFileURL = await uploadFile( files[0] );  
      res.status(201).send({ status: true,msg: "file uploaded succesfully", data: uploadedFileURL });

    } 
    else {
      res.status(400).send({ status: false, msg: "No file to write" });
    }

  } 
  catch (err) {
    console.log("error is: ", err);
    res.status(500).send({ status: false, msg: "Error in uploading file" });
  }

});

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
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;

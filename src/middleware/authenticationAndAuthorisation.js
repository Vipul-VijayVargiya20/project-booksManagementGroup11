const jwt = require("jsonwebtoken");
const bookModel = require("../model/bookModel")
const ObjectId = require('mongoose').Types.ObjectId



const authenticationUser = function (req, res, next){
        try {
           let token = req.headers["x-api-key"];
           if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
           let decodedToken = jwt.verify(token,"bookprojectGroup11",{ignoreExpiration:true});
           if (!decodedToken)return res.status(400).send({ status: false, msg: "token is invalid" }); // this verify the token that token is correct or not
           let a = Math.floor(Date.now()/1000)
           if(decodedToken.exp<a)return res.status(401).send({ status: false, msg: "token is expired" });
           next()
        }catch (err) {
           res.status(500).send({ status: false, Error: err.message });
        }}
     


 const authorisationUser = async function(req, res, next) {
        try{
            let bookToBeModified = req.body.userId
            let token = req.headers["x-api-key"]
            let decodedToken = jwt.verify(token,"bookprojectGroup11")
            let userLoggedIn = decodedToken.userId
            if (bookToBeModified != userLoggedIn) return res.status(400).send({ status: false, msg: "authentication denied" })
            next()
          }catch (err) {
            res.status(500).send({ status: false, Error: err });
         }}

 const bookAuthorise = async function(req,res,next){ 
        try{     
            let token = req.headers["x-api-key"];
            let bookId = req.params.bookId;
            if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"Invalid Book Id"})
            let bookDetails = await bookModel.findById(bookId)
            let userId = bookDetails.userId
            let decodedToken = jwt.verify(token, "bookprojectGroup11");
            if (!decodedToken)return res.status(400).send({ status: false, msg: "token is invalid" });
            let decoded = decodedToken.userId
            if (userId != decoded)return res.status(400).send({ status: false, msg: "anthentication denied" })
         next()
      } 
      catch (err) {
         res.status(500).send({ status: false, Error: err.message });
      }
   }
      









module.exports.authenticationUser  = authenticationUser ;
module.exports.authorisationUser = authorisationUser;
module.exports.bookAuthorise = bookAuthorise;
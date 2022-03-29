const UserModel = require("../model/userModel")
const jwt = require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
   return true

}
const isValidRequestBody = function (requestBody) {
return Object.keys(requestBody).length > 0
}


const createUser = async function (req, res) {
try {
let data = req.body
const { title, name, phone, email, password, address } = data

if (!isValidRequestBody(data))
return res.status(400).send({ status: false, msg: "Please Enter some data" })
if (!isValid(data.title)) {
return res.status(400).send({ status: false, msg: "title is Required" })
}
        
if (!isValid(data.name)) {
return res.status(400).send({ status: false, msg: "name is Required" })
}
if (isValid(data.phone))
if (!(/^([+]\d{2})?\d{10}$/.test(data.phone)))
return res.status(400).send({ status: false, msg: "Please Enter  a Valid Phone Number" })

function checkIndianNumber(b)   
{  var a = /^[6-9]\d{9}$/gi;  
if (a.test(b))   
{  return true;  
    }   
else  
 {  
return false; 
}  
};
let phoneCheck =checkIndianNumber(phone);
if (phoneCheck == false)
 return res.status(400).send({ status: false, msg: "please enter a valid phone number" })
if (!isValid(data.phone))
 return res.status(400).send({ status: false, msg: "phone is required" })
 
//  let alreadyExist = await UserModel.findOne({ phone: data.phone })
// if (alreadyExist) {
// return res.status(400).send({ status: false, msg: "phone already exist" })
// }

if (isValid(data.email))
if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)))
 return res.status(400).send({ status: false, msg: "is not a valid email" })
if (!isValid(data.email))
return res.status(400).send({ status: false, msg: "email is required" })

        
let alreadyExistEmail = await UserModel.findOne({ email: data.email })
if (alreadyExistEmail) {
 return res.status(400).send({ status: false, msg: "email already exist" })
}

if (!isValid(data.password)) {
return res.status(400).send({ status: false, msg: "Password is Required" })
}
if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(data.password))) {
return res.status(400).send({ status: false, msg: "please provide valid password with one uppercase letter ,one lowercase, one character and one number " })
 }
if (isValid(data.address.pincode))

if (!(/^([+]\d{2})?\d{6}$/.test(data.address.pincode)))
 return res.status(400).send({ status: false, msg: "Please Enter  a Valid pincode Number" })


let savedData = await UserModel.create(data)
res.status(201).send({ msg: savedData })

}
 catch (err) {
 res.status(500).send({ status: false, msg: err.message })
}
}

const loginUser = async function (req, res) {
try {
let body = req.body
if (Object.keys(body) != 0) {
let userName = req.body.email;
let passwords = req.body.password;
if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userName))) { return res.status(400).send({ status: false, msg: "Please provide a valid email" }) }
if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(passwords))) {
return res.status(400).send({ status: false, msg: "please provide valid password with one uppercase letter ,one lowercase, one character and one number " })
}
let user = await UserModel.findOne({ email: userName, password: passwords });

if (!user) {
return res.status(400).send({
status: false,
 ERROR: "username or the password is not correct",
});
}

let token = jwt.sign(
{
 userId: user._id,
email: user._email

}, "bookprojectGroup11", { expiresIn: "5hr" }

);
res.status(200).setHeader("x-api-key", token);
return res.status(201).send({ status: "loggedin", token: token });
}

else { return res.status(400).send({ ERROR: "Bad Request" }) }

}
catch (err) {

return res.status(500).send({ ERROR: err.message })
}

};


module.exports.createUser = createUser;
module.exports.loginUser = loginUser;

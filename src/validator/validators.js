const ObjectId = require('mongoose').Types.ObjectId

const isValid = (value) => {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    if(typeof value !== 'string') return false
    return true ;
}

const isValidRequestBody = (requestBody) => {
    if(Object.keys(requestBody).length > 0) {
        return true
    }else
        return false
}

const isValidObjectId = (objectId) => {
    if( ObjectId.isValid( objectId ) ) {
        return true
    }else
        return false
}

const isValidTitle = (title) => {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

const isValidPhone = ( phone ) => {
    return /^([+]\d{2})?\d{10}$/.test(phone)
}

const isValidEmail = ( email ) => {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
}

const isValidPassword = (password) =>{
    return /[a-zA-Z0-9@]{8,15}/.test(password)
}

const isValidPincode = ( pincode ) => {
    return /^[1-9][0-9]{5}$/.test(pincode)
}

const isValidISBN = ( ISBN ) => {
    return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)
}

const isValidReleasedAt = (releasedAt) => {
    return /((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)
}



module.exports = {
    isValid,
    isValidRequestBody,
    isValidTitle,
    isValidPhone,
    isValidPassword,
    isValidPincode,
    isValidObjectId,
    isValidEmail,
    isValidISBN,
    isValidReleasedAt
    
}
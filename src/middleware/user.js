import jwt from "jsonwebtoken"
import User from "../models/User.js";
import Product from "../models/Product.js";
import {ObjectId} from "mongodb" 

export const getUser = async (req, res, next) => {
  const token = req.cookies.token
  if(!token){
    next()
    return
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findById(decode.id)
  req.userId = user._id

  next()
}

export const checkAuthor = async (req, res, next) => {
  const {id} = req.params
  const product = await Product.findOne({_id: new ObjectId(`${id}`)}).lean()
  
  if(!req.userId){
    res.redirect("/")
    next()
    return
  }

  if(product.user.toString() !== req.userId.toString()){
    res.redirect("/")
    return
  }
  next()
}
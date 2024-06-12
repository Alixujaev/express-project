import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const getUser = async (req, res, next) => {
  const token = req.cookies.token
  const decode = jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findById(decode.id)
  req.userId = user._id

  next()
}
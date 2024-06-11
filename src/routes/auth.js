import { Router } from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt"
import { generateNewToken } from "../services/token.js";
import { checkLogin } from "../middleware/auth.js";
const router = Router();

router.get("/login", checkLogin, (req, res) => {
  res.render("login", {
    loginError: req.flash("loginError")
  })
})

router.get("/register", checkLogin, (req, res) => {
  res.render("register", {
    registerError: req.flash("registerError")
  })
})

router.get("/logout", (req, res) => {
  res.clearCookie("token")
  res.redirect("/login")
})


router.post("/login", async(req, res) => {
  const {email, password} = req.body
  const existUser = await User.findOne({email})

  if(!email || !password){
    req.flash("loginError", "All fields are required!")
    res.redirect("/login")
    return
  }

  if(!existUser){
    req.flash("loginError", "User not found!")
    res.redirect("/login")
    return
  }

  const isEqualPass = await bcrypt.compare(password, existUser.password)

  if(!isEqualPass){
    req.flash("loginError", "Password is not correct!")
    res.redirect("/login")
    return
  }

  const token = generateNewToken(existUser._id)
  res.cookie("token", token, {httpOnly: true, secure: true})
  res.redirect("/")
})

router.post("/register", async (req, res) => {
  const {firstname, lastname, email, password} = req.body
  const hashedPass = await bcrypt.hash(req.body.password, 10)
  const existUser = await User.findOne({email})

  if(!firstname || !lastname || !email || !password){
    req.flash("registerError", "All fields are required!")
    res.redirect("/register")
    return
  }

  if(existUser){
    req.flash("registerError", "User already exists!")
    res.redirect("/register")
    return
  }
  const userData = await User.create({
    ...req.body,
    password: hashedPass
  })

  const token = generateNewToken(userData._id)
  res.cookie("token", token, {httpOnly: true, secure: true})

  res.redirect("/")
})

export default router
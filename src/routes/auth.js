import { Router } from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt"
const router = Router();

router.get("/login", (req, res) => {
  res.render("login")
})

router.get("/register", (req, res) => {
  res.render("register")
})


router.post("/login", async(req, res) => {
  const existUser = await User.findOne({email: req.body.email})

  if(!existUser){
    console.log("User not found!");

    return
  }

  const isEqualPass = await bcrypt.compare(req.body.password, existUser.password)

  if(!isEqualPass){
    console.log("Password is not correct!");
    return
  }

  console.log(existUser);
  res.redirect("/")
})

router.post("/register", async (req, res) => {
  const hashedPass = await bcrypt.hash(req.body.password, 10)
  const userData = await User.create({
    ...req.body,
    password: hashedPass
  })

  res.redirect("/")
})

export default router
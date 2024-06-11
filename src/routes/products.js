import { Router } from "express";
import Product from "../models/Product.js"
import { checkAuth } from "../middleware/auth.js";
import { getUser } from "../middleware/user.js";

const router = Router();

router.get("/", async (req, res) => {
  res.render("index", {
    products: await Product.find({}).lean()
  })
})

router.get("/add", checkAuth, (req, res) => {
  res.render("add", {
    addProductError: req.flash("addProductError")
  })
})

router.get("/products", (req, res) => {
  res.render("products")
})


router.post("/add-product", getUser, async (req, res) => {
  const {title, description, image, price} = req.body

  if(!title || !description|| !image || !price){
    req.flash("addProductError", "All fields are required!")
    res.redirect("/add")
    return
  }

  if(!Number(price)){
    req.flash("addProductError", "Price must be a number!")
    res.redirect("/add")
    return
  }

  if(!req.userId){
    res.redirect("/login")``
    return
  }

  await Product.create({...req.body, user: req.userId})


  res.redirect("/")
})

export default router
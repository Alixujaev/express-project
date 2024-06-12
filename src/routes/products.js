import { Router } from "express";
import Product from "../models/Product.js"
import { checkAuth } from "../middleware/auth.js";
import { getUser } from "../middleware/user.js";
import {ObjectId} from "mongodb" 
import User from "../models/User.js";

const router = Router();

router.get("/", getUser, async (req, res) => {
  const products = await Product.find({}).lean()
  res.render("index", {
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null
  })
})

router.get("/add", checkAuth, (req, res) => {
  
  res.render("add", {
    addProductError: req.flash("addProductError")
  })
})

router.get("/my-products", getUser, async(req, res) => {
  const user = req.userId ? req.userId.toString() : null
  const products = await Product.find({user}).lean()

  res.render("products", {
    products
  })
})


router.get("/products/:id", getUser, async (req, res) => {
  const {id} = req.params
  const product = await Product.findOne({_id: new ObjectId(id)}).lean()
  const author = await User.findOne({_id: new ObjectId(product.user)}).lean()

  console.log(author);

  res.render("product", {
    product: {...product, author_firstname: author.firstname, author_lastname: author.lastname},
    userId: req.userId ? req.userId.toString() : null
  })
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
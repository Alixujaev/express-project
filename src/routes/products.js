import { Router } from "express";
import Product from "../models/Product.js"
import { checkAuth } from "../middleware/auth.js";
import { checkAuthor, getUser } from "../middleware/user.js";
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

router.get("/my-products", checkAuth, getUser, async(req, res) => {
  const user = req.userId ? req.userId.toString() : null
  const products = await Product.find({user}).lean()

  res.render("products", {
    products,
    userId: user
  })
})


router.get("/products/:id", getUser, async (req, res) => {
  const {id} = req.params
  const product = await Product.findOne({_id: new ObjectId(id)}).lean()
  const author = await User.findOne({_id: new ObjectId(product.user)}).lean()


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

router.get("/edit/:id", getUser, checkAuthor, async (req, res) => {
  const {id} = req.params
  const product = await Product.findOne({_id: new ObjectId(id)}).lean()

  res.render("edit", {
    product,  
    userId: req.userId ? req.userId.toString() : null,
    updateError: req.flash("updateError")
  })
})

router.post("/edit/:id", getUser, async (req, res) => {
  const {title, description, image, price} = req.body

  if(!title || !description|| !image || !price){
    req.flash("updateError", "All fields are required!")
    res.redirect("/add")
    return
  }

  if(!Number(price)){
    req.flash("updateError", "Price must be a number!")
    res.redirect("/add")
    return
  }

  if(!req.userId){
    res.redirect("/login")``
    return
  }

  await Product.updateOne({_id: new ObjectId(req.params.id)}, {...req.body, user: req.userId})

  res.redirect("/")
})

router.get("/delete/:id", async (req, res) => {
  res.redirect("/")
})

router.post("/delete/:id", getUser, checkAuthor, async (req, res) => {
  const {id} = req.params
  await Product.deleteOne({_id: new ObjectId(id)})
  res.redirect("/")
})

export default router
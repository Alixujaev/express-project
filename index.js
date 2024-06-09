import express from "express"
import { create } from "express-handlebars"
import AuthRoutes from "./src/routes/auth.js"
import ProductsRoutes from "./src/routes/products.js"
import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()

const hbs = create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './src');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(AuthRoutes)
app.use(ProductsRoutes)
const PORT = process.env.PORT || 8000

const connectApp = () => {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }, () => console.log("Database connected"))
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error);
  }
}


connectApp()
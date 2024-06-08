import express from "express"
import { create } from "express-handlebars"
import AuthRoutes from "./src/routes/auth.js"
import ProductsRoutes from "./src/routes/products.js"

const app = express()

const hbs = create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './src');


app.use(AuthRoutes)
app.use(ProductsRoutes)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
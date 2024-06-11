import { Schema, model } from "mongoose";

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
}, {timestamps: true});

const Product = model("Product", productSchema);

export default Product
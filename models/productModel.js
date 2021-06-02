const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  imgUrl: String,
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Date,
});

productSchema.statics.mostRecent = async function () {
  return this.find().populate("seller").sort("createdAt").exec();
};

module.exports = model("Product", productSchema);

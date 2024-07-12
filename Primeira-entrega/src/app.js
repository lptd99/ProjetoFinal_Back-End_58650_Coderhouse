const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const path = require("path");
const express = require("express");
const logMw = require("./middlewares/log.middleware");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(`${__dirname}/../public`)));

app.use(logMw);

app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

// app.use((req, res, next) => {
//   console.log("Request Method:", req.method);
//   console.log("Request URL:", req.url);
//   console.log("Request Headers:", req.headers);
//   console.log("Request Body:", req.body);
//   next();
// });

// app.get("/products/search", (req, res) => {
//   const { title, description, price, thumbnail, stock, code } = req.query;
//   let filteredProducts = products;
//   console.log(title, description, price, thumbnail, stock, code);
//   console.log(filteredProducts);
//   if (title) {
//     filteredProducts = filteredProducts.filter((product) =>
//       product.title.toLowerCase().includes(title.toLowerCase())
//     );
//   }
//   if (description) {
//     filteredProducts = filteredProducts.filter((product) =>
//       product.description.toLowerCase().includes(description.toLowerCase())
//     );
//   }
//   if (price) {
//     filteredProducts = filteredProducts.filter(
//       (product) => product.price === parseFloat(price)
//     );
//   }
//   if (thumbnail) {
//     filteredProducts = filteredProducts.filter((product) =>
//       product.thumbnail.toLowerCase().includes(thumbnail.toLowerCase())
//     );
//   }
//   if (stock) {
//     filteredProducts = filteredProducts.filter(
//       (product) => product.stock === parseInt(stock)
//     );
//   }
//   if (code) {
//     filteredProducts = filteredProducts.filter(
//       (product) => product.code === code
//     );
//   }
//   if (filteredProducts.length === 0) {
//     return res.status(404).json({ message: "Nenhum produto encontrado." });
//   }
//   return res.status(200).json(filteredProducts);
// });

module.exports = app;

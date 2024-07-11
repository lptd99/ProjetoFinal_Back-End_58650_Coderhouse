const express = require("express");

const ProductManager = require("./productManagerFS.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pMProductsPath = "./src/products.json";
const pMCartsPath = "./src/carts.json";
const pM = new ProductManager(pMProductsPath);
let products = [];

// app.use((req, res, next) => {
//   console.log("Request Method:", req.method);
//   console.log("Request URL:", req.url);
//   console.log("Request Headers:", req.headers);
//   console.log("Request Body:", req.body);
//   next();
// });

app.get("/products", async (req, res) => {
  products = await pM.getProducts();
  let { limit } = req.query;
  if (!limit) return res.status(200).json(products);
  let limitedProducts = products.slice(0, parseInt(limit));
  return res.status(200).json(limitedProducts);
});

app.get("/products/:id", async (req, res) => {
  try {
    products = await pM.getProducts();
    const { id } = req.params;
    const product = products.find((product) => product.id === parseInt(id));
    if (product) {
      return res.status(200).json({ product });
    } else {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro na requisição." });
  }
});

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

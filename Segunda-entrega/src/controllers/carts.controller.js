const CartManager = require("../cartManagerFS.js");
const cartsPath = "./src/data/carts.json";
const cartManager = new CartManager(cartsPath);
const ProductManager = require("../productManagerFS.js");
const productsPath = "./src/data/products.json";
const productManager = new ProductManager(productsPath);

let carts = [];
let products = [];

const getCarts = async (req, res) => {
  try {
    carts = await cartManager.getCarts();
    let { limit } = req.query;
    if (!limit) return res.status(200).json(carts);
    let limitedCarts = carts.slice(0, parseInt(limit));
    return res.status(200).json(limitedCarts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro na requisição de busca de Carrinhos." });
  }
};

const getCartById = async (req, res) => {
  try {
    carts = await cartManager.getCarts();
    const { id } = req.params;
    const cart = carts.find((cart) => cart.id === parseInt(id));
    if (cart) {
      return res.status(200).json({ cart });
    } else {
      return res.status(404).json({ message: "Carrinho não encontrado" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro na requisição de busca de Carrinho por ID." });
  }
};

const addCart = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    if (carts.length === 0) {
      await cartManager.saveCartsToFile([{ id: 1, products: [] }]);
      return res.status(201).json("Carrinho com id 1 criado com sucesso!");
    }
    const nextId = carts[carts.length - 1].id + 1;
    carts.push({ id: nextId, products: [] });
    await cartManager.saveCartsToFile(carts);
    return res
      .status(201)
      .json(`Carrinho com id ${nextId} criado com sucesso!`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Erro na requisição de criação de Carrinho.",
    });
  }
};

const deleteCart = async (req, res) => {
  try {
    let carts = await cartManager.getCarts();
    const currentLength = carts.length;
    const { id } = req.params;
    if (carts.length === 0) {
      return res.status(404).json({ message: "Nenhum carrinho encontrado." });
    }
    carts = carts.filter((cart) => cart.id !== parseInt(id));
    console.log(carts.length);
    if (carts.length === currentLength) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    } else {
      await cartManager.saveCartsToFile(carts);
      return res
        .status(200)
        .json({ message: "Carrinho removido com sucesso!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro na requisição de remoção de Carrinho." });
  }
};

const addProductToCart = async (req, res) => {
  try {
    carts = await cartManager.getCarts();
    products = await productManager.getProducts();
    const { cid, pid } = req.params;
    const cart = carts.find((cart) => cart.id === parseInt(cid));
    const product = products.find((product) => product.id === parseInt(pid));
    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    cartManager.addProductToCart(parseInt(cid), parseInt(pid));
    return res
      .status(200)
      .json({ message: "Produto adicionado ao carrinho com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      message: "Erro na requisição de adição de produto ao Carrinho.",
    });
  }
};

module.exports = {
  getCarts,
  getCartById,
  addProductToCart,
  addCart,
  deleteCart,
};

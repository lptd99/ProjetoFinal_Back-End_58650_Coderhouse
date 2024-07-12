const ProductManager = require("../productManagerFS.js");
const productsPath = "./src/data/products.json";
const productManager = new ProductManager(productsPath);

let products = [];

const getProducts = async (req, res) => {
  try {
    products = await productManager.getProducts();
    let { limit } = req.query;
    if (!limit) return res.status(200).json(products);
    let limitedProducts = products.slice(0, parseInt(limit));
    return res.status(200).json(limitedProducts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro na requisição de busca de Produtos." });
  }
};

const getProductById = async (req, res) => {
  try {
    products = await productManager.getProducts();
    const { id } = req.params;
    const product = products.find((product) => product.id === parseInt(id));
    if (product) {
      return res.status(200).json({ product });
    } else {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro na requisição de busca de Produto por ID." });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnails,
      stock,
      code,
      status,
      category,
    } = req.body;
    products = await productManager.getProducts();
    const nextId = products[products.length - 1].id + 1;
    const productToAdd = {
      id: nextId,
      title: title,
      description: description,
      price: price,
      thumbnails: thumbnails,
      stock: stock,
      code: code,
      status: status,
      category: category,
    };

    if (productManager.validateProduct(productToAdd)) {
      products.push(productToAdd);
      await productManager.saveProductsToFile(products);
      return res.status(201).json(productToAdd);
    } else {
      return res
        .status(400)
        .json({ message: "Adição de produto rejeitada. Dados inválidos." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Erro na requisição de adição de Produto.",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    products = await productManager.getProducts();
    const {
      title,
      description,
      price,
      thumbnail,
      stock,
      code,
      status,
      category,
    } = req.body;
    const { id } = req.params;
    const productIndex = products.findIndex(
      (product) => product.id === parseInt(id)
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    const updatedProduct = {
      id: parseInt(id),
      title,
      description,
      price,
      thumbnail,
      stock,
      code,
      status,
      category,
    };
    if (productManager.validateProductUpdating(updatedProduct, parseInt(id))) {
      products = await productManager.getProducts();
      products[productIndex] = updatedProduct;
      await productManager.saveProductsToFile(products);
      return res.status(200).json(updatedProduct);
    } else {
      return res
        .status(400)
        .json({ message: "Alteração de produto rejeitada. Dados inválidos." });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro na requisição de alteração de Produto." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    products = await productManager.getProducts();
    const currentLength = products.length;
    const { id } = req.params;
    products = products.filter((product) => product.id !== parseInt(id));

    if (products.length === currentLength) {
      return res.status(404).json({ message: "Produto não encontrado." });
    } else {
      await productManager.saveProductsToFile(products);
      return res.status(200).json({ message: "Produto removido com sucesso!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro na requisição de remoção de Produto." });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

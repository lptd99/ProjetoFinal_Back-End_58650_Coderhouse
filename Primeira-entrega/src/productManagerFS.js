fs = require("fs");

const debug = false;
const d = (text) => {
  if (debug) {
    console.log("[DEBUG]:", text);
  }
};

class ProductManager {
  #lastProductId = 0;
  #path = "";
  #products = [];
  constructor(path) {
    this.#path = path || "";
    this.#products = [];
    this.loadProductsFromFile();
  }

  loadProductsFromFile = async () => {
    try {
      d("Loading products from file...");
      let data = await fs.promises.readFile(this.#path, "utf-8");
      this.#products = JSON.parse(data);
      this.#lastProductId = this.#products.length;
      d("Products loaded from file!");
      d("Products:", data);
      return this.#products;
    } catch (error) {
      console.log("Error", error);
    }
  };

  saveProductsToFile = async (products) => {
    try {
      if (products) {
        this.#products = products;
      }
      d("Saving products to file...");
      d("Products:", this.#products);
      const dataToSave = JSON.stringify(this.#products, null, 2);
      await fs.promises.writeFile(this.#path, dataToSave);
      d("Products saved to file!");
    } catch (error) {
      if (this.#path === "") {
        console.error("Path not defined!");
      }
      console.error("Error", error);
    }
  };

  validateTitle(title) {
    const result = title && title !== null && title.trim().length > 0;
    d(`Validating Title "${title}" ... ${result ? "OK" : "ERROR"}`);
    return result;
  }

  validateDescription(description) {
    const result =
      description && description !== null && description.trim().length > 0;
    d(`Validating Description "${description}" ... ${result ? "OK" : "ERROR"}`);
    return result;
  }

  validatePrice(price) {
    const result = price && price !== null && price >= 0;
    d(`Validating Price ${price} ... ${result ? "OK" : "ERROR"}`);
    return result;
  }

  validateThumbnail(thumbnail) {
    const result =
      thumbnail && thumbnail !== null && thumbnail.trim().length > 0;
    d(`Validating Thumbnail "${thumbnail}" ... ${result ? "OK" : "ERROR"}`);
    return result;
  }

  validateStock(stock) {
    const result = stock && stock !== null && stock >= 0;
    d(`Validating Stock ${stock} ... ${result ? "OK" : "ERROR"}`);
    return result;
  }

  validateCode(code) {
    const result =
      code &&
      code !== null &&
      this.#products.find((product) => product.code === code) === undefined;
    d(`Validating Code "${code}" ... ${result ? "OK" : "ERROR"}`);
    return result;
  }

  validateProduct(product) {
    const result =
      this.validateTitle(product.title) &&
      this.validateDescription(product.description) &&
      this.validatePrice(product.price) &&
      this.validateThumbnail(product.thumbnail) &&
      this.validateStock(product.stock) &&
      this.validateCode(product.code);
    d(`Validating Product of id ${product.id} ... ${result ? "OK" : "ERROR"}`);
    return result;
  }
  validateProductUpdating(product, id) {
    const products = this.#products;
    console.log("ID:", id);
    console.log("Products:", products);
    const productsUnchanged = products.filter((product) => product.id !== id);
    console.log("Products Unchanged:", productsUnchanged);
    this.#products = productsUnchanged;
    const result =
      this.validateTitle(product.title) &&
      this.validateDescription(product.description) &&
      this.validatePrice(product.price) &&
      this.validateThumbnail(product.thumbnail) &&
      this.validateStock(product.stock) &&
      this.validateCode(product.code);
    d(`Validating Product of id ${product.id} ... ${result ? "OK" : "ERROR"}`);
    this.products = products;
    return result;
  }

  addProduct = async (title, description, price, thumbnail, stock, code) => {
    try {
      await this.loadProductsFromFile();
      const id = this.#lastProductId + 1;
      const product = {
        id: id,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        stock: stock,
        code: code,
      };
      d(`Adding product:
      id: ${id},
      title: "${title}",
      description: "${description}",
      price: ${price},
      thumbnail: "${thumbnail}",
      stock: ${stock},
      code: '${code}'`);
      if (this.validateProduct(product)) {
        this.#products.push(product);
        this.#lastProductId = id;
        await this.saveProductsToFile();
        console.log(`Produto '${title}' criado com sucesso!`);
      } else {
        console.log(
          `Falha na criação do Produto '${title}', exibindo informações:`
        );
        console.log(product);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  updateProduct = async (id, updatedProduct) => {
    try {
      await this.loadProductsFromFile();
      d(`Updating product with id ${id} ...`);
      let productToUpdate = await getProductById(id);
      if (productToUpdate) {
        d("Old product:", productToUpdate);
        d("New product:", updatedProduct);
        productToUpdate = updatedProduct;
        console.log(`Produto com id ${id} atualizado com sucesso!`);
        d("Updated product:", productToUpdate);
      } else {
        console.log(
          `Falha na atualização: nenhum produto encontrado com id ${id}.`
        );
      }
      const index = this.#products.findIndex((product) => product.id === id);
      this.#products[index] = updateProduct;
      await this.saveProductsToFile();
    } catch (error) {
      console.log("Error", error);
    }
  };

  removeProductById = async (id) => {
    try {
      await this.loadProductsFromFile();
      const initialLength = this.#products.length;
      d(`Removing product with id ${id}`);
      if (this.#products.find((product) => product.id === id) === undefined) {
        console.log(
          `Falha na remoção: nenhum produto encontrado com id ${id}.`
        );
      } else {
        d("Before removal:");
        d(this.#products);
        const productsAfterRemoval = this.#products.filter(
          (product) => product.id !== id
        );
        if (productsAfterRemoval.length < initialLength) {
          this.#products = productsAfterRemoval;
          await this.saveProductsToFile();
          console.log(`Produto com id ${id} removido com sucesso!`);
          d("After removal:");
          d(this.#products);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  getProducts = async () => {
    try {
      await this.loadProductsFromFile();
      d("Getting all " + this.#products.length + " products:");
      d(this.#products);
      // console.log("Produtos:", this.#products);
      return this.#products;
    } catch (error) {
      console.log("Error", error);
    }
  };

  getProductById = async (id) => {
    try {
      await this.loadProductsFromFile();
      const product = this.#products.find((product) => product.id === id);
      if (product) {
        d(`Getting product with id ${id}: ${product}`);
        console.log(
          "Produto com id " + id + " encontrado com sucesso:",
          product
        );
        return product;
      } else {
        console.log("Nenhum produto encontrado com id " + id);
        return undefined;
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
}

// const pM = new ProductManager();

// console.log("Products: ", pM.getProducts());

// pM.addProduct("Produto 1", "Desc 1", 20, "thumb/1", 10, "SKU7198");
// pM.addProduct(null, "Desc 2", 347, "thumb/2", 20, "SKU7199");
// pM.addProduct("Produto 3", null, 10, "thumb/3", 30, "SKU7200");
// pM.addProduct("Produto 4", "Desc 4", null, "thumb/4", 40, "SKU7201");
// pM.addProduct("Produto 5", "Desc 5", 10, null, 50, "SKU7202");
// console.log("Products: ", pM.getProducts());

// pM.addProduct("Produto 6", "Desc 6", 20, "thumb/6", null, "SKU7");
// pM.addProduct("Produto 7", "Desc 7", 30, "thumb/7", 70, null);
// pM.addProduct("Produto 8", "Desc 8", 40, "thumb/8", 80, "SKU7205");
// pM.addProduct(undefined, "Desc 9", 50, "thumb/9", 90, "SKU7206");
// pM.addProduct("Produto 10", undefined, 60, "thumb/10", 10, "SKU7207");
// pM.addProduct("Produto 11", "Desc 11", undefined, "thumb/11", 11, "SKU7208");
// pM.addProduct("Produto 12", "Desc 12", 80, undefined, 12, "SKU7209");
// pM.addProduct("Produto 13", "Desc 13", 90, "thumb/13", undefined, "SKU7210");
// pM.addProduct("Produto 14", "Desc 14", 10, "thumb/14", 14, undefined);
// pM.addProduct("", "Desc 15", 11, "thumb/15", 15, "SKU7212");
// pM.addProduct("Produto 16", "", 12, "thumb/16", 16, "SKU7213");
// pM.addProduct("Produto 17", "Desc 17", -37, "thumb/17", 17, "SKU7214");
// console.log("Products: ", pM.getProducts());

// pM.addProduct("Produto 18", "Desc 18", 14, "", 18, "SKU7215");
// pM.addProduct("Produto 19", "Desc 19", 1500, "thumb/19", -49, "SKU7216");
// pM.addProduct("Produto 20", "Desc 20", 1600, "thumb/20", 200, "");
// pM.addProduct("Produto 22", "Desc 22", 1800, "thumb/22", 220, "SKU7219");
// pM.addProduct("Produto 23", "Desc 23", 1900, "thumb/23", 230, "SKU7220");
// console.log("Products: ", pM.getProducts());

// pM.getProductById(2);
// pM.getProductById(3);
// pM.getProductById(3);
// pM.getProductById(37);
// console.log("Products: ", pM.getProducts());
// pM.removeProductById(1);
// pM.removeProductById(2);
// console.log("Products: ", pM.getProducts());
// pM.removeProductById(3);
// pM.removeProductById(4);
// console.log("Products: ", pM.getProducts());
// pM.removeProductById(4);

// console.log("Products: ", pM.getProducts());

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateRandomProduct = (min, max) => {
  const n = rand(min, max);
  return {
    title: `Produto ${n}`,
    description: `Descrição ${n}`,
    price: n,
    thumbnail: `thumb/${n}`,
    stock: n,
    code: `SKU72${n}`,
  };
};

const addRandomProducts = async (pM, quantity, min, max) => {
  try {
    for (let i = 0; i < quantity; i++) {
      const product = generateRandomProduct(min, max);
      await pM.addProduct(
        product.title,
        product.description,
        product.price,
        product.thumbnail,
        product.stock,
        product.code
      );
    }
  } catch (error) {
    console.log("Error", error);
  }
};

const addsRandom = async (pM) => {
  addRandomProducts(pM, 50, -100, 100);
};

const gets10Random = async (pM) => {
  await pM.getProducts();
  for (let i = 1; i <= 10; i++) {
    randomId = rand(-10, 200);
    await pM.getProductById(randomId);
  }
};

const removes10Random = async (pM) => {
  await pM.getProducts();
  for (let i = 1; i <= 10; i++) {
    randomId = rand(-10, 200);
    await pM.removeProductById(randomId);
  }
};

const main = async () => {
  const path = "./products.json";
  const pM = new ProductManager(path);
  await pM.loadProductsFromFile();

  await addsRandom(pM);

  await gets10Random(pM);

  await removes10Random(pM);

  await pM.getProducts();
};

module.exports = ProductManager;

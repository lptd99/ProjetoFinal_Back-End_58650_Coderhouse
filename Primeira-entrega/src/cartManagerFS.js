fs = require("fs");

const debug = false;
const d = (text) => {
  if (debug) {
    console.log("[DEBUG]:", text);
  }
};

class CartManager {
  #lastCartId = 0;
  #path = "";
  #carts = [];
  constructor(path) {
    this.#path = path || "";
    this.#carts = [];
    this.loadCartsFromFile();
  }

  loadCartsFromFile = async () => {
    try {
      d("Loading carts from file...");
      let data = await fs.promises.readFile(this.#path, "utf-8");
      this.#carts = JSON.parse(data);
      this.#lastCartId = this.#carts.length;
      d("Carts loaded from file!");
      d("Carts:", data);
      return this.#carts;
    } catch (error) {
      console.log("Error", error);
    }
  };

  saveCartsToFile = async (carts) => {
    try {
      if (carts) {
        this.#carts = carts;
      }
      d("Saving carts to file...");
      d("Carts:", this.#carts);
      const dataToSave = JSON.stringify(this.#carts, null, 2);
      await fs.promises.writeFile(this.#path, dataToSave);
      d("Carts saved to file!");
    } catch (error) {
      if (this.#path === "") {
        console.error("Path not defined!");
      }
      console.error("Error", error);
    }
  };

  createCart = async () => {
    try {
      await this.loadCartsFromFile();
      this.#lastCartId = this.#carts[this.#carts.length - 1].id;
      const cart = {
        id: this.#lastCartId + 1,
        products: [],
      };
      this.#lastCartId++;
      this.#carts.push(cart);
      await this.saveCartsToFile();
      console.log(`Carrinho criado com sucesso!`);
    } catch (error) {
      console.log("Error ao criar carrinho", error);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      await this.loadCartsFromFile();
      const cartIndex = this.#carts.findIndex((cart) => cart.id === cartId);
      const productIndex = this.#carts[cartIndex].products.findIndex(
        (product) => product.id === productId
      );
      console.log(productIndex);
      if (productIndex != -1) {
        console.log(this.#carts);
        this.#carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        this.#carts[cartIndex].products.push({ id: productId, quantity: 1 });
      }
      await this.saveCartsToFile();
      console.log(
        `Produto com id ${productId} adicionado ao carrinho ${cartId} com sucesso!`
      );
    } catch (error) {
      console.log("Erro na função de adição de Produto a Carrinho", error);
    }
  };

  removeCartById = async (id) => {
    try {
      const carts = await this.loadCartsFromFile();
      const initialLength = carts.length;
      d(`Removing cart with id ${id}`);
      if (this.#carts.find((cart) => cart.id === id) === undefined) {
        console.log(
          `Falha na remoção: nenhum carrinho encontrado com id ${id}.`
        );
      } else {
        d("Before removal:");
        d(this.#carts);
        const cartsAfterRemoval = this.#carts.filter((cart) => cart.id !== id);
        if (cartsAfterRemoval.length < initialLength) {
          this.#carts = cartsAfterRemoval;
          await this.saveCartsToFile();
          console.log(`Carrinho com id ${id} removido com sucesso!`);
          d("After removal:");
          d(this.#carts);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  getCarts = async () => {
    try {
      await this.loadCartsFromFile();
      d("Getting all " + this.#carts.length + " carts:");
      d(this.#carts);
      // console.log("Produtos:", this.#carts);
      return this.#carts;
    } catch (error) {
      console.log("Error", error);
    }
  };

  getCartById = async (id) => {
    try {
      await this.loadCartsFromFile();
      const cart = this.#carts.find((cart) => cart.id === id);
      if (cart) {
        d(`Getting cart with id ${id}: ${cart}`);
        console.log("Carrinho com id " + id + " encontrado com sucesso:", cart);
        return cart;
      } else {
        console.log("Nenhum carrinho encontrado com id " + id);
        return undefined;
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
}

// const pM = new CartManager();

// console.log("Carts: ", pM.getCarts());

// pM.addCart("Produto 1", "Desc 1", 20, "thumb/1", 10, "SKU7198");
// pM.addCart(null, "Desc 2", 347, "thumb/2", 20, "SKU7199");
// pM.addCart("Produto 3", null, 10, "thumb/3", 30, "SKU7200");
// pM.addCart("Produto 4", "Desc 4", null, "thumb/4", 40, "SKU7201");
// pM.addCart("Produto 5", "Desc 5", 10, null, 50, "SKU7202");
// console.log("Carts: ", pM.getCarts());

// pM.addCart("Produto 6", "Desc 6", 20, "thumb/6", null, "SKU7");
// pM.addCart("Produto 7", "Desc 7", 30, "thumb/7", 70, null);
// pM.addCart("Produto 8", "Desc 8", 40, "thumb/8", 80, "SKU7205");
// pM.addCart(undefined, "Desc 9", 50, "thumb/9", 90, "SKU7206");
// pM.addCart("Produto 10", undefined, 60, "thumb/10", 10, "SKU7207");
// pM.addCart("Produto 11", "Desc 11", undefined, "thumb/11", 11, "SKU7208");
// pM.addCart("Produto 12", "Desc 12", 80, undefined, 12, "SKU7209");
// pM.addCart("Produto 13", "Desc 13", 90, "thumb/13", undefined, "SKU7210");
// pM.addCart("Produto 14", "Desc 14", 10, "thumb/14", 14, undefined);
// pM.addCart("", "Desc 15", 11, "thumb/15", 15, "SKU7212");
// pM.addCart("Produto 16", "", 12, "thumb/16", 16, "SKU7213");
// pM.addCart("Produto 17", "Desc 17", -37, "thumb/17", 17, "SKU7214");
// console.log("Carts: ", pM.getCarts());

// pM.addCart("Produto 18", "Desc 18", 14, "", 18, "SKU7215");
// pM.addCart("Produto 19", "Desc 19", 1500, "thumb/19", -49, "SKU7216");
// pM.addCart("Produto 20", "Desc 20", 1600, "thumb/20", 200, "");
// pM.addCart("Produto 22", "Desc 22", 1800, "thumb/22", 220, "SKU7219");
// pM.addCart("Produto 23", "Desc 23", 1900, "thumb/23", 230, "SKU7220");
// console.log("Carts: ", pM.getCarts());

// pM.getCartById(2);
// pM.getCartById(3);
// pM.getCartById(3);
// pM.getCartById(37);
// console.log("Carts: ", pM.getCarts());
// pM.removeCartById(1);
// pM.removeCartById(2);
// console.log("Carts: ", pM.getCarts());
// pM.removeCartById(3);
// pM.removeCartById(4);
// console.log("Carts: ", pM.getCarts());
// pM.removeCartById(4);

// console.log("Carts: ", pM.getCarts());

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateRandomCart = (min, max) => {
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

const addRandomCarts = async (pM, quantity, min, max) => {
  try {
    for (let i = 0; i < quantity; i++) {
      const cart = generateRandomCart(min, max);
      await pM.addCart(
        cart.title,
        cart.description,
        cart.price,
        cart.thumbnail,
        cart.stock,
        cart.code
      );
    }
  } catch (error) {
    console.log("Error", error);
  }
};

const addsRandom = async (pM) => {
  addRandomCarts(pM, 50, -100, 100);
};

const gets10Random = async (pM) => {
  await pM.getCarts();
  for (let i = 1; i <= 10; i++) {
    randomId = rand(-10, 200);
    await pM.getCartById(randomId);
  }
};

const removes10Random = async (pM) => {
  await pM.getCarts();
  for (let i = 1; i <= 10; i++) {
    randomId = rand(-10, 200);
    await pM.removeCartById(randomId);
  }
};

const main = async () => {
  const path = "./carts.json";
  const pM = new CartManager(path);
  await pM.loadCartsFromFile();

  await addsRandom(pM);

  await gets10Random(pM);

  await removes10Random(pM);

  await pM.getCarts();
};

module.exports = CartManager;

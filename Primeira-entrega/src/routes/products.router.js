const Router = require("express");
const productsController = require("../controllers/products.controller");

const router = Router();

router.get("/", productsController.getProducts);
router.post("/", productsController.addProduct);
router.get("/:id", productsController.getProductById);
router.put("/:id", productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

module.exports = router;

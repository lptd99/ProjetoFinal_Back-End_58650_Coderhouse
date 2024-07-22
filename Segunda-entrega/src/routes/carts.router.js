const Router = require("express");
const cartsController = require("../controllers/carts.controller");

const router = Router();

router.get("/", cartsController.getCarts);
router.post("/", cartsController.addCart);
router.post("/:cid/products/:pid", cartsController.addProductToCart);
router.get("/:id", cartsController.getCartById);
router.delete("/:id", cartsController.deleteCart);

module.exports = router;

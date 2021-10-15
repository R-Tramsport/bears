import express from "express"

import ItemsController from "./items.controller.js"

const router = express.Router();

router.route("/").get(ItemsController.apiGetItems);
router.route("/item")
    .post(ItemsController.apiPostItem)
    .put(ItemsController.apiUpdateItem)
    .delete(ItemsController.apiDeleteItem)

export default router;
const express = require("express");
const router = express.Router();
const checkAuthentication = require("../middlewares/checkAuthentication");
const CategoryController = require("../controllers/CategoryController");

// Create a new router for category routes
const categoryRouter = express.Router();

categoryRouter.post('/create', CategoryController.create);
categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getOne);
categoryRouter.put('/:id', CategoryController.update);
categoryRouter.delete('/:id', CategoryController.destroy);

// Use the category router for routes under /category
router.use('/category', checkAuthentication, categoryRouter);

module.exports = router;

const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication");
const CategoryController = require("../controllers/CategoryController");
const BlogController = require("../controllers/BlogController");


// Create a new router for category routes
const categoryRouter = express.Router();

categoryRouter.post('/create', CategoryController.create);
categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getOne);
categoryRouter.put('/:id', CategoryController.update);
categoryRouter.delete('/:id', CategoryController.destroy);

// Use the category router for routes under /category
router.use('/category', CheckAuthentication, categoryRouter);


// Create a new router for blog routes
const blogRouter = express.Router();

blogRouter.post('/create', BlogController.create);
blogRouter.get('/', BlogController.getAll);
blogRouter.get('/:id', BlogController.getOne);
blogRouter.put('/:id', BlogController.update);
blogRouter.delete('/:id', BlogController.destroy);

// Use the blog router for routes under /blog
router.use('/blog', CheckAuthentication, blogRouter);

module.exports = router;

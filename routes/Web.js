const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication");
const CategoryController = require("../controllers/CategoryController");
const CommentController = require("../controllers/CommentController");


// Create a new router for category routes
const categoryRouter = express.Router();

categoryRouter.post('/create', CategoryController.create);
categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getOne);
categoryRouter.put('/:id', CategoryController.update);
categoryRouter.delete('/:id', CategoryController.destroy);

// Use the category router for routes under /category
router.use('/category', CheckAuthentication, categoryRouter);



const commentRouter = express.Router();

commentRouter.post('/create', CommentController.create);
commentRouter.get('/', CommentController.getAll);
commentRouter.get('/:id', CommentController.getOne);
commentRouter.put('/:id', CommentController.update);
commentRouter.delete('/:id', CommentController.destroy);

// Use the category router for routes under /category
router.use('/comment', CheckAuthentication, commentRouter);

module.exports = router;
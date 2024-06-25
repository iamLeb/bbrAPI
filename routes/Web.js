const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication");
const CategoryController = require("../controllers/CategoryController");
const ContactController = require("../controllers/ContactController");

/**
 * Category Routes
 */
// Create a new router for category routes
const categoryRouter = express.Router();

categoryRouter.post('/create', CategoryController.create);
categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getOne);
categoryRouter.put('/:id', CategoryController.update);
categoryRouter.delete('/:id', CategoryController.destroy);

// Use the category router for routes under /category
router.use('/category', CheckAuthentication, categoryRouter);

/**
 * Category Routes Ends
 */

/**
 * Category Routes
 */
// Create a new router for category routes
const contactRouter = express.Router();

contactRouter.post('/create', ContactController.create);
contactRouter.get('/', ContactController.getAll);
contactRouter.get('/:id', ContactController.getOne);
contactRouter.delete('/:id', ContactController.destroy);

// Use the category router for routes under /category
router.use('/contact', contactRouter);

/**
 * Category Routes Ends
 */


module.exports = router;

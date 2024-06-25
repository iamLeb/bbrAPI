const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication");
const CategoryController = require("../controllers/CategoryController");
const ContactController = require("../controllers/ContactController");
const GalleryController = require("../controllers/GalleryController");
const TestimonialController = require("../controllers/TestimonialController");

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
 * Contact Routes
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
 * Contact Routes Ends
 */

/**
 * Gallery Routes
 */
// Create a new router for category routes
const galleryRouter = express.Router();

galleryRouter.post('/create', GalleryController.create);
galleryRouter.get('/', GalleryController.getAll);
galleryRouter.get('/:id', GalleryController.getOne);
galleryRouter.put('/:id', GalleryController.update);
galleryRouter.delete('/:id', GalleryController.destroy);

// Use the category router for routes under /category
router.use('/gallery', CheckAuthentication, galleryRouter);

/**
 * Gallery Routes Ends
 */

/**
 * Category Routes
 */
// Create a new router for category routes
const testimonial = express.Router();

testimonial.post('/create', TestimonialController.create);
testimonial.get('/', TestimonialController.getAll);
testimonial.get('/:id', TestimonialController.getOne);
testimonial.put('/:id', TestimonialController.update);
testimonial.delete('/:id', TestimonialController.destroy);

// Use the category router for routes under /category
router.use('/testimonial', CheckAuthentication, testimonial);

/**
 * Category Routes Ends
 */


module.exports = router;

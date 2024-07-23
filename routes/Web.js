const express = require("express");
const router = express.Router();
const CheckAuthentication = require("../middlewares/CheckAuthentication");
const CategoryController = require("../controllers/CategoryController");
const BlogController = require("../controllers/BlogController");
const CommentController = require("../controllers/CommentController");
const ContactController = require("../controllers/ContactController");
const GalleryController = require("../controllers/GalleryController");
const TestimonialController = require("../controllers/TestimonialController");
const NeighbourhoodController = require("../controllers/NeighbourhoodController");
const FileController = require("../controllers/FileController");
const PropertyController = require("../controllers/PropertyController");
const AvailabilityController = require("../controllers/AvailabilityController");
const MediaController = require("../controllers/MediaController");
const BookingController = require("../controllers/BookingController")
const multer = require('multer');


const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({
    storage: inMemoryStorage,
    limits: {fileSize: 100 * 1024 * 1024},
}).single("file");

// for multiple files
const uploadStrategyMultiple = multer({
    storage: inMemoryStorage,
    limits: {fileSize: 100 * 1024 * 1024},
}).array("files", 10);

/**
 * Category Routes
 */
// Create a new router for category routes
const categoryRouter = express.Router();

categoryRouter.post("/create", CheckAuthentication, CategoryController.create);
categoryRouter.get("/", CategoryController.getAll);
categoryRouter.get("/:id", CategoryController.getOne);
categoryRouter.put("/:id", CheckAuthentication, CategoryController.update);
categoryRouter.delete("/:id", CheckAuthentication, CategoryController.softDelete);

// Use the category router for routes under /category
router.use("/category", categoryRouter);

// Create a new router for blog routes
const blogRouter = express.Router();

blogRouter.post("/create", CheckAuthentication, BlogController.create);
blogRouter.get("/", BlogController.getAll);
blogRouter.get("/:id", BlogController.getOne);
blogRouter.put("/:id", CheckAuthentication, BlogController.update);
blogRouter.delete("/:id", CheckAuthentication, BlogController.destroy);

// Use the blog router for routes under /blog
router.use("/blog", blogRouter);
/**
 * Category Routes Ends
 */

/**
 * Contact Routes
 */
// Create a new router for Contact routes
const contactRouter = express.Router();

contactRouter.post("/create", CheckAuthentication, ContactController.create);
contactRouter.get("/", ContactController.getAll);
contactRouter.get("/:id", ContactController.getOne);
contactRouter.delete("/:id", CheckAuthentication, ContactController.destroy);

// Use the Contact router for routes under /Contact
router.use("/contact", contactRouter);

/**
 * Contact Routes Ends
 */

/**
 * Gallery Routes
 */
// Create a new router for Gallery routes
const galleryRouter = express.Router();

galleryRouter.post("/create", CheckAuthentication, GalleryController.create);
galleryRouter.get("/", GalleryController.getAll);
galleryRouter.get("/:id", GalleryController.getOne);
galleryRouter.put("/:id", CheckAuthentication, GalleryController.update);
galleryRouter.delete("/:id", GalleryController.destroy);

// Use the Gallery router for routes under /Gallery
router.use("/gallery", galleryRouter);

/**
 * Gallery Routes Ends
 */

/**
 * Testimonial Routes
 */
// Create a new router for Testimonial routes
const testimonial = express.Router();

testimonial.post("/create", CheckAuthentication, TestimonialController.create);
testimonial.get("/", TestimonialController.getAll);
testimonial.get("/:id", TestimonialController.getOne);
testimonial.put("/:id", CheckAuthentication, TestimonialController.update);
testimonial.delete("/:id", CheckAuthentication, TestimonialController.destroy);

// Use the testimonial router for routes under /testimonial
router.use("/testimonial", testimonial);

/**
 * Testimonial Routes Ends
 */

/**
 * Province Routes
 */
// Create a new router for province routes
const neighbourhoodRouter = express.Router();

neighbourhoodRouter.post("/create", CheckAuthentication, NeighbourhoodController.create);
neighbourhoodRouter.get("/", NeighbourhoodController.getAll);
neighbourhoodRouter.get("/:id", NeighbourhoodController.getOne);
neighbourhoodRouter.put("/:id", CheckAuthentication, NeighbourhoodController.update);
neighbourhoodRouter.delete("/:id", CheckAuthentication, NeighbourhoodController.softDelete);

// Use the category router for routes under /category
router.use("/neighbourhood", neighbourhoodRouter);

/**
 * Province Routes Ends
 */

/**
 * Comment Routes
 */
const commentRouter = express.Router();

commentRouter.post("/create", CheckAuthentication, CommentController.create);
commentRouter.get("/", CommentController.getAll);
commentRouter.get("/:id", CommentController.getOne);
commentRouter.put("/:id", CheckAuthentication, CommentController.update);
commentRouter.delete("/:id", CheckAuthentication, CommentController.destroy);

// Use the comment router for routes under /comment
router.use("/comment", commentRouter);

/**
 * Comment Routes Ends
 */

/**
 * File Routes
 */

const fileRouter = express.Router();

fileRouter.post("/upload", uploadStrategy, FileController.uploadFile);
fileRouter.post(
    "/upload-multiple",
    uploadStrategyMultiple,
    FileController.uploadMultiple
);

// Use the file router for routes under /file
router.use("/file", fileRouter);

/**
 * File Routes Ends
 */

/**
 * Media Routes
 */

const mediaRouter = express.Router();

mediaRouter.post("/create", MediaController.create);
mediaRouter.get('/getMediaForOwner/:ownerId', MediaController.getMediaForOwner);
mediaRouter.get('/getMultipleMedia/:ownerId', MediaController.getMultipleMedia);
mediaRouter.delete('/:id', MediaController.destroy);
mediaRouter.get("/", MediaController.getAll);
mediaRouter.get("/:id", MediaController.getOne);
mediaRouter.put("/:id", MediaController.update);

// Use the media router for routes under /media
router.use("/media", mediaRouter);

/**
 * Media Routes Ends
 */


/**
 * Property Routes
 */

const propertyRouter = express.Router();

propertyRouter.post("/create", PropertyController.create);
propertyRouter.get("/", PropertyController.getAll);
propertyRouter.get("/:id", PropertyController.getOne);
propertyRouter.put("/:id", PropertyController.update);
propertyRouter.delete("/:id", PropertyController.destroy);

propertyRouter.post("/search", PropertyController.sort);
propertyRouter.get("/category/:category", PropertyController.getCategory);
// Use the file router for routes under /property
router.use("/property", propertyRouter);

/**
 * Availability Routes
 */
// Create a new router for availability routes
const availabilityRouter = express.Router();

availabilityRouter.post("/create", CheckAuthentication, AvailabilityController.create);
availabilityRouter.get("/:date", CheckAuthentication, AvailabilityController.getOne);
availabilityRouter.get("/month/:year/:month", AvailabilityController.getThreeMonthAvailability);

// Use the availability router for routes under /availability
router.use("/availability", availabilityRouter);


// Create a new router for booking routes
const bookingRouter = express.Router();

// Add the create route for bookings
bookingRouter.post("/create", BookingController.create);

// Use the booking router for routes under /booking
router.use("/booking", bookingRouter);

module.exports = router;

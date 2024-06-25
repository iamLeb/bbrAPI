const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const checkAuthentication = require("../middlewares/checkAuthentication");
const CategoryController = require("../controllers/CategoryController");


router.post('/category/create', checkAuthentication, CategoryController.create);
router.get('/category', checkAuthentication, CategoryController.getAll);
router.get('/category/:id', checkAuthentication, CategoryController.getOne);
router.put('/category/:id', checkAuthentication, CategoryController.update);
router.delete('/category/:id', checkAuthentication, CategoryController.destroy);

module.exports = router;
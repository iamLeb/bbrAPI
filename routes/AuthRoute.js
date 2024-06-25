const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const checkAuthentication = require("../middlewares/checkAuthentication");

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/check', checkAuthentication, AuthController.checkAuth);
router.get('/logout', AuthController.logout);

module.exports = router;
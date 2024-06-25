const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const CheckAuthentication = require("../middlewares/CheckAuthentication");

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/check', CheckAuthentication, AuthController.checkAuth);
router.get('/logout', AuthController.logout);

module.exports = router;
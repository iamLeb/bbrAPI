const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const checkAuthentication = require("../middlewares/checkAuthentication");

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/check', checkAuthentication, AuthController.checkAuth);
router.get('/auth/logout', AuthController.logout);

module.exports = router;
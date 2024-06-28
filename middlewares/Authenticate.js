const CheckAuthentication = require('../middlewares/CheckAuthentication');
const isAdmin = require('./isAdmin');

const Authenticate = (req, res, next) => {
    const middlewares = [
        CheckAuthentication,
        isAdmin,
    ];

    // Use the middlewares in sequence
    const runMiddlewares = (index) => {
        if (index < middlewares.length) {
            middlewares[index](req, res, () => runMiddlewares(index + 1));
        } else {
            next();
        }
    };

    runMiddlewares(0);
};

module.exports = Authenticate;

const { config } = require('dotenv');
const { HttpException } = require('./exception');

const requireProcessEnv = name => {
    if (!process.env[name]) {
        throw new HttpException(500, 'You must set the ' + name + ' environment variable');
    }
    return process.env[name];
};
if (process.env.NODE_ENV !== 'production') {
    config({ path: `.env` });
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8080;
const DB = requireProcessEnv('DB');

const S3_BUCKET_NAME = requireProcessEnv('S3_BUCKET_NAME');
const AWS_ACCESS_KEY = requireProcessEnv('AWS_ACCESS_KEY');
const AWS_SECRET_ACCESS_KEY = requireProcessEnv('AWS_SECRET_ACCESS_KEY');
const AWS_BASE_URL = requireProcessEnv('AWS_BASE_URL');

module.exports = {
    NODE_ENV,
    PORT,
    DB,
    S3_BUCKET_NAME,
    AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY,
    AWS_BASE_URL,
}

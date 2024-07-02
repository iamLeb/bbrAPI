const AWS = require("aws-sdk");
const {
  S3_BUCKET_NAME,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_BASE_URL,
} = require("../config/config");

class FileService {
  s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });

  async uploadFileAWS(file) {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ACL: "public-read",
    };

    const data = await this.s3.upload(params).promise();
    if (data.Location) {
      const url = data.Location;
      console.log(data);
      return {
        url: url,
        name: data.Key,
      };
    }
  }
}

module.exports = FileService;

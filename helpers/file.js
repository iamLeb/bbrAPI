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
    // Generate timestamp to use as part of the S3 Key
    const timestamp = Date.now().toString();
    
    // Extract file extension to maintain original file type
    const fileExtension = file.originalname.split('.').pop();
    
    // Key will be timestamp + file extension
    const key = `${timestamp}.${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ACL: "public-read",
    };

    try {
      const data = await this.s3.upload(params).promise();
      if (data.Location) {
        const url = data.Location;
        
        // Check if file is image or video
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");
        const type = isImage ? "image" : isVideo ? "video" : "unknown";

        return {
          url: url,
          name: key, // Use the generated key as the name
          type: type,
        };
      }
    } catch (error) {
      throw new Error(`Error uploading file to AWS S3: ${error.message}`);
    }
  }
}

module.exports = FileService;

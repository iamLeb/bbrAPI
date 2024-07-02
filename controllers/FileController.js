const FileService = require("../helpers/file.js");

class FileController {
    
  static uploadFile = async (req, res)  => {
    try {
      const file = req.file;
      const fileService = new FileService();
      const url = await fileService.uploadFileAWS(file);
      return res.status(200).json(url);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }


  // upload multiple
  static uploadMultiple = async (req, res) => {
    try {
      const files = req.files;
      const fileService = new FileService();
      const urls = [];
      for (const file of files) {
        const url = await fileService.uploadFileAWS(file);
        urls.push(url);
      }
      return res.status(200).json(urls);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

}

module.exports = FileController;

const fs = require('fs');
const xlsx = require('xlsx');
const multer = require("multer");
const moment = require('moment');

const uploadFile = require("../middlewares/uploadFiles");
//const uploadFile = require("../middlewares/multipleUpload");


exports.UploadClaimInvoices = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.files == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    } else if (req.files.length) {
      console.log('req.files--', req.files);

      let filenames = [];
      req.files.forEach(element => {
        const filename = {
          filename: element.filename,
          originalname: element.originalname
        }
        filenames.push(filename);
      });
      return res.status(200).send({status:200, message: "File uploaded successfully.", data: filenames });
    }
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

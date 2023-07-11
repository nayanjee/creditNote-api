const util = require("util");
const multer = require("multer");
const moment = require('moment');
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/uploads/files");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);
    const dateTime = moment().format("YYYY-MM-DD-hhmmss");
    const fileName = file.originalname.split('.');
    const len = parseInt(fileName.length) - 1;
    // const finalFileName = fileName[0]+'_'+dateTime+'.'+fileName[len];
    const finalFileName = dateTime + '_' + fileName[0] + '.' + fileName[len];
    cb(null, finalFileName);
  },
});

let uploadFile = multer({
  storage: storage,
  // limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    console.log('FILE---', file);
    console.log('FILE mimetype---', file.mimetype);
    if (
      file.mimetype == "image/jpeg" || 
      file.mimetype == "image/png" || 
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error('Only .jpg, .jpeg, .png and .pdf extensions allowed!'));
      return cb('Only .jpg, .jpeg, .png and .pdf extensions allowed!');
    }
  }
//}).single("file");
}).array("file", 100);

// var uploadFiles = multer({ storage: storage }).array("file", 2);
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
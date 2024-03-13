/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 01/06/2023 - 10:50:59
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/06/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dbConfig = require("./app/config/db.config");


var corsOptions = {
  //origin: "http://localhost:4200"
  origin: "http://65.1.70.106:7872"
};

global.__basedir = __dirname;

const app = express();
app.use(cors(corsOptions));
app.use(express.json());  // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true }));  // parse requests of content-type - application/x-www-form-urlencoded
app.use(express.static('public'));




/* app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */

/* const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('req--', req);
    console.log('file--', file);
    cb(null, __dirname + "/public/uploads/files")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const uploadStorage = multer({ storage: storage });
app.post("/api/UploadClaimInvoices", uploadStorage.array("file", 2), (req, res) => {
  //console.log(req);
  console.log(req.files)
  return res.send("Multiple files")
}) */





const db = require("./app/models");
const Portal = db.portal;

db.mongoose
  //.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect("mongodb://laadmin:lar3n0n787@0.0.0.0:27017/dataplex?authSource=admin&retryWrites=false", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json("You are on the wrong track. Please check your address and port. I would like to inform you that this is a Larenone Healthcare Pvt. Ltd.'s property and tampering with it will be considered against the law.");
});


// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/upload.routes")(app);

require("./app/routes/generic_user.routes")(app);
require("./app/routes/generic_crud.routes")(app);
require("./app/routes/generic_portal.routes")(app);
require("./app/routes/generic_permission.routes")(app);
require("./app/routes/generic_access.routes")(app);


require("./app/routes/common_batch.routes")(app);
require("./app/routes/common_product.routes")(app);
require("./app/routes/common_division.routes")(app);
require("./app/routes/common_stockiest.routes")(app);
require("./app/routes/common_particular.routes")(app);
require("./app/routes/common_distributor.routes")(app);

require("./app/routes/cn_claim.routes")(app);
require("./app/routes/cn_sales.routes")(app);
require("./app/routes/cn_setting.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 7871;
// const PORT = process.env.PORT || 7087;  // Live
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/* function initial() {
  Portal.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Portal({ name: "user" }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Portal({ name: "moderator" }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Portal({ name: "admin" }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
} */

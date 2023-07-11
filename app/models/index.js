/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 01/05/2023 - 15:17:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/05/2023
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose     = mongoose;
db.log          = require("./la_log.model");
db.gen_user         = require("./generic_user.model");
db.gen_crud         = require("./generic_crud.model");
db.gen_admin        = require("./generic_admin.model");
db.gen_portal       = require("./generic_portal.model");
db.gen_permission   = require("./generic_permission.model");

db.com_batch = require("./common_batch.model");
db.com_product = require("./common_product.model");
db.com_division = require("./common_division.model");
db.com_stockiest = require("./common_stockiest.model");

db.cn_claim = require("./cn_claim.model");
db.cn_setting = require("./cn_setting.model");
db.cn_claim_file = require("./cn_claim_file.model");


module.exports = db;

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

db.mongoose = mongoose;
db.log = require("./la_log.model");
db.gen_user = require("./generic_user.model");
db.gen_crud = require("./generic_crud.model");
db.gen_admin = require("./generic_admin.model");
db.gen_portal = require("./generic_portal.model");
db.gen_permission = require("./generic_permission.model");
db.gen_access = require("./generic_access.model");

db.com_batch = require("./common_batch.model");
db.com_product = require("./common_product.model");
db.com_division = require("./common_division.model");
db.com_category = require("./common_category.model");
db.com_stockiest = require("./common_stockiest.model");
db.com_particular = require("./common_particular.model");
db.com_distributor = require("./common_distributor.model");

db.cn_claim = require("./cn_claim.model");
db.cn_sales = require("./cn_sales.model");
db.cn_setting = require("./cn_setting.model");
db.cn_sales_ho = require("./cn_sales_ho.model");
db.cn_claim_file = require("./cn_claim_file.model");
db.cn_sales_remaining_quantity = require("./cn_sales_remaining_quantity.model");
db.cn_sales_allocated_quantity = require("./cn_sales_allocated_quantity.model");


module.exports = db;

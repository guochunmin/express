var express = require('express');
var router = express.Router();
require("./ctrls/index")(router);
require("./ctrls/login")(router);
module.exports = function(app){
	app.use("/",router)
};

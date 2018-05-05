var express = require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require('path');
var mysql = require('mysql');
var routes = require("./routes/routes.js");
var app = express();
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "EXPERTING"
});
con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected The TEST DB");
});
app.set('port', (process.env.PORT || 5000));
app.use(cookieParser());
app.use(session({ secret: "Shh, its a secret!" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
routes(app, con);
app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
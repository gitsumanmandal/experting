var express = require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require('path');
var routes = require("./routes/routes.js");
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

routes(app);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
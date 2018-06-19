var faker = require("faker");
var Request = require("request");
var fs = require('fs');
var path = require('path');
var user = "";
var sessionid;

var appRouter = function (app, con) {

  app.get("/validate", function (req, res) {
    con.query('SELECT * FROM USER WHERE USERID = "' + req.query.userid + '" and SESSIONID = "' + req.query.sessionid + '"', function (err, result, fields) {
      if (err) throw err;
      var data = { validate: null };
      if (result.length == 1) {
        data.validate = true;
      }
      else {
        data.validate = false;
      }
      res.status(200).send(data);
    });
  });

  app.get("/getLearned", function (req, res) {
    user = req.query.userid;
    Request.get("http://localhost:5000/validate?sessionid=" + req.query.sessionid + "&userid=" + req.query.userid, (error, response, body) => {
      if (!JSON.parse(response.body).validate) {
        res.status(400).send("response:{status: 'FAILURE', message: 'Invalid Session'}");
        return;
      }
      if ((req.query.word).indexOf("%") != -1) {
        res.status(200).send({ dataDictionary: [] });
        return;
      }
      var returnData = {
        dataDictionary: null
      };
      con.query('SELECT ID, WORD FROM WORDBASE WHERE word like "%' + req.query.word + '%"', function (err, result, fields) {
        if (err) throw err;
        var dataSource = {
          dictionary: null
        };
        if (result.length == 0) {
          returnData.dataDictionary = [];
          res.status(200).send(returnData);
        }
        else {
          dataSource.dictionary = result;
          con.query("SELECT SET1 FROM LEARNED WHERE USERID = '" + user + "'", function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].SET1);
            var dataArray = [];
            if (result[0].SET1 == "") {
              returnData.dataDictionary = [];
              res.status(200).send(returnData);
              return;
            }
            var toSet = JSON.parse(result[0].SET1);
            for (var i = 0; i < toSet.length; i++) {
              for (var j = 0; j < dataSource.dictionary.length; j++) {
                if (toSet[i].id == dataSource.dictionary[j].ID) {
                  var obj = {
                    id: toSet[i].id,
                    word: dataSource.dictionary[j].WORD,
                    count: toSet[i].count
                  };
                  dataArray.push(obj);
                  break;
                }
              }
            }
            returnData.dataDictionary = dataArray;
            res.status(200).send(returnData);
          });
        }
      });
    });
  });

  app.get("/getDefinition", function (req, res) {
    user = req.query.userid;
    Request.get("http://localhost:5000/validate?sessionid=" + req.query.sessionid + "&userid=" + req.query.userid, (error, response, body) => {
      if (!JSON.parse(response.body).validate) {
        res.status(400).send("response:{status: 'FAILURE', message: 'Invalid Session'}");
        return;
      }
      Request.get("http://api.wordnik.com/v4/word.json/" + req.query.word + "/definitions?limit=200&includeRelated=true&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5", (error, response, body) => {
        if (error) {
          return console.dir(error);
        }
        if (body == "") {
          res.status(200).send([]);
          return;
        }
        console.dir(JSON.parse(body));
        data = JSON.parse(body);
        var mainid = 0;
        if (data.length > 0) {
          con.query('SELECT ID FROM WORDBASE WHERE word = "' + req.query.word + '"', function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            if (result.length == 0) {
              /**new word entry to WORDBASE**/
              var theword = req.query.word;
              var part = (data[0].partOfSpeech) ? data[0].partOfSpeech : "";
              var data1 = (data[0]) ? data[0].text : "";
              var data2 = (data[1]) ? data[1].text : "";
              var data3 = (data[2]) ? data[2].text : "";
              var data4 = (data[3]) ? data[3].text : "";
              var data5 = (data[4]) ? data[4].text : "";
              var data6 = (data[5]) ? data[5].text : "";
              var data7 = (data[6]) ? data[6].text : "";
              var data8 = (data[7]) ? data[7].text : "";
              var data9 = (data[8]) ? data[8].text : "";
              var data10 = (data[9]) ? data[9].text : "";
              var sql = "INSERT INTO WORDBASE (WORD,PART,MEAN1,MEAN2,MEAN3,MEAN4,MEAN5,MEAN6,MEAN7,MEAN8,MEAN9,MEAN10) VALUES ?";
              var values = [[theword, part, data1, data2, data3, data4, data5, data6, data7, data8, data9, data10]];
              con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                con.query("SELECT MAX(ID) FROM WORDBASE", function (err, result, fields) {
                  if (err) throw err;
                  console.log(result[0]['MAX(ID)']);
                  var newSet = result[0]['MAX(ID)'];
                  con.query("SELECT SET1 FROM LEARNED WHERE USERID = '" + user + "'", function (err, result, fields) {
                    if (err) throw err;
                    console.log(result[0].SET1);
                    var set;
                    if (result[0].SET1 == "") {
                      set = [];
                    }
                    else {
                      set = JSON.parse(result[0].SET1);
                    }
                    var obj = {
                      id: newSet,
                      count: 1
                    };
                    set.push(obj);
                    var dataSet = JSON.stringify(set);
                    var sqlT = "UPDATE LEARNED SET SET1 = '" + dataSet + "' WHERE USERID = '" + user + "'";
                    con.query(sqlT, function (err, result) {
                      if (err) throw err;
                      console.log("1 record inserted");
                    });
                  });
                });
              });
            }
            else {
              mainid = result[0].ID;
              con.query("SELECT SET1 FROM LEARNED WHERE USERID = '" + user + "'", function (err, result, fields) {
                if (err) throw err;
                console.log(result[0].SET1);
                var str = result[0].SET1;
                var num = mainid;

                var toSet;
                if (result[0].SET1 == "") {
                  toSet = [];
                  var obj = {
                    id: mainid,
                    count: 1
                  };
                  toSet.push(obj);
                }
                else {
                  var flag = 0;
                  toSet = JSON.parse(str);
                  for (var i = 0; i < toSet.length; i++) {
                    if (toSet[i].id == mainid) {
                      toSet[i].count = toSet[i].count + 1;
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    var obj = {
                      id: mainid,
                      count: 1
                    };
                    toSet.push(obj);
                  }
                }
                var dataSet = JSON.stringify(toSet);
                var sqlT = "UPDATE LEARNED SET SET1 = '" + dataSet + "' WHERE USERID = '" + user + "'";
                con.query(sqlT, function (err, result) {
                  if (err) throw err;
                  console.log("1 record inserted");
                });
              });
            }
          });
        }
        res.status(200).send(data);
      });
    });
  });

  app.get("/loginauth", function (req, res) {
    sessionid = Math.floor((Math.random() * 100000000000000000000) + 1);
    var uid = req.query.userid;
    var pass = req.query.passkey;
    var tosend = {
      data: null,
      status: null,
      sessionid: null
    };
    con.query('SELECT * FROM USER WHERE USERID = "' + uid + '" and PASSWORD="' + pass + '"', function (err, result, fields) {
      if (err) throw err;
      if (result.length == 0) {
        var statobj = {
          response: "FAILURE",
          message: "Invalid Credential"
        }
        tosend.data = [];
        tosend.status = statobj;
        res.status(200).send(tosend);
        return;
      }
      user = result[0].USERID;
      var sqlT = "UPDATE USER SET SESSIONID = '" + sessionid + "' WHERE USERID = '" + user + "'";
      con.query(sqlT, function (err, sessionout) {
        if (err) throw err;
        var obj = {
          userid: result[0].USERID,
          email: result[0].EMAIL,
          name: result[0].NAME,
          phone: result[0].PHONE
        };
        var statobj = {
          response: "SUCCESS",
          message: "Successfully Logged in"
        }
        tosend.data = obj;
        tosend.status = statobj;
        tosend.sessionid = sessionid;
        res.status(200).send(tosend);
      });
    });
  });

  app.get("/logout", function (req, res) {
    sessionid = Math.floor((Math.random() * 100000000000000000000) + 1);
    Request.get("http://localhost:5000/validate?sessionid=" + req.query.sessionid + "&userid=" + req.query.userid, (error, response, body) => {
      if (!JSON.parse(response.body).validate) {
        res.status(400).send("response:{status: 'FAILURE', message: 'Invalid Session'}");
        return;
      }
      var sqlT = "UPDATE USER SET SESSIONID = '" + sessionid + "' WHERE USERID = '" + user + "'";
      con.query(sqlT, function (err, sessionout) {
        res.status(200).send("response:{status: 'SUCCESS', message: 'Logged Out'}");
      });
    });
  });

  app.post("/signupauth", function (req, res) {
    console.log(req);
    var f1 = /^([a-zA-Z0-9 ]{1,})$/.test(req.body.name);
    var f2 = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(req.body.email);
    var f3 = /^([a-zA-Z0-9!@#&*]{1,})$/.test(req.body.userid);
    var f4 = /^([0-9]{10})$/.test(req.body.phone);
    var f5 = (req.body.passkey.indexOf('%') != -1 || req.body.passkey.indexOf(' ') != -1 || req.body.passkey == '') ? false : true;
    if (!f1 || !f2 || !f3 || !f4 || !f5) {
      res.status(200).send({ status: 'FAILURE', response: ['INVALID_INPUT'] });
      return;
    }
    con.query('SELECT * FROM USER WHERE EMAIL = "' + req.body.email + '"', function (err, result, fields) {
      if (err) throw err;
      var responseObj = [];
      if (result[0] != undefined) {
        responseObj.push("EMAILID_EXIST");
      }
      con.query('SELECT * FROM USER WHERE USERID = "' + req.body.userid + '"', function (err, result, fields) {
        if (err) throw err;
        if (result[0] != undefined) {
          responseObj.push("USERID_EXIST");
        }
        if (responseObj.length == 0) {
          var sql = "INSERT INTO USER (USERID, PASSWORD, EMAIL, NAME, PHONE) VALUES ?";
          var values = [[req.body.userid, req.body.passkey, req.body.email, req.body.name, req.body.phone]];
          con.query(sql, [values], function (err, result) {
            if (err) throw err;
            var sqlT = "INSERT INTO LEARNED (USERID) VALUES ?";
            var values = [[req.body.userid]];
            con.query(sqlT, [values], function (err, result) {
              res.status(200).send({ status: 'SUCCESS', response: ['User created'] });
            });
          });
        }
        else {
          res.status(200).send({ status: 'FAILURE', response: responseObj });
        }
      });
    });
  });

  app.post("/change", function (req, res) {
    Request.get("http://localhost:5000/validate?sessionid=" + req.body.sessionid + "&userid=" + req.body.mainuserid, (error, response, body) => {
      if (!JSON.parse(response.body).validate) {
        res.status(400).send("response:{status: 'FAILURE', message: 'Invalid Session'}");
        return;
      }
      else {
        console.log(req);
        var responseObj = [];
        var f1 = /^([a-zA-Z0-9 ]{1,})$/.test(req.body.name);
        var f2 = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(req.body.email);
        var f3 = /^([a-zA-Z0-9!@#&*]{1,})$/.test(req.body.userid);
        var f4 = /^([0-9]{10})$/.test(req.body.phone);
        var f5 = (req.body.passkey.indexOf('%') != -1 || req.body.passkey.indexOf(' ') != -1 || req.body.passkey == '') ? false : true;
        if ((req.body.name != "" && !f1) || (req.body.email != "" && !f2) || (req.body.userid != "" && !f3) || (req.body.phone != "" && !f4) || (req.body.passkey != "" && !f5)) {
          res.status(200).send({ status: 'FAILURE', response: ['INVALID_INPUT'] });
          return;
        }
        var sqlT = "UPDATE USER SET"; // SET1 = '" + dataSet + "' WHERE USERID = '" + user + "'";
        if (req.body.name != "") {
          sqlT += " NAME = '" + req.body.name + "',";
        }
        if (req.body.phone != "") {
          sqlT += " PHONE = '" + req.body.phone + "',";
        }
        if (req.body.passkey != "") {
          sqlT += " PASSWORD = '" + req.body.passkey + "',";
        }
        sqlT = sqlT.substring(0, sqlT.lastIndexOf(','));
        sqlT += " WHERE USERID = '" + req.body.mainuserid + "'";

        con.query(sqlT, function (err, sessionout) {
          if (err) throw err;
          res.status(200).send({ status: 'SUCCESS' });
          return;
        });
      }
    });
  });

  app.post("/forgotpassword", function (req, res) {
    var flag = /^([a-zA-Z0-9!@#&*]{1,})$/.test(req.query.user);
    if(!flag){
      res.status(200).send({status: "FAILURE"});
      return;
    }
    var sql = "INSERT INTO SERVICE (USERID, STATUS) VALUES ?";
              var values = [[req.query.user, "PENDING"]];
              con.query(sql, [values], function (err, result) {
                if(err) throw err;
                res.status(200).send({status: "SUCCESS"});
              });    
  });

}

module.exports = appRouter;
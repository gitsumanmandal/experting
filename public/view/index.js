function bodyLoad() {
  $('#resultsection').hide();
  $('#resultsectionLearn').hide();
  $('#resultsectionLearnSde').hide();
  if (sessionStorage.getItem('userid') == null) {
    window.location.href = "http://localhost:5000/login/";
  }
  else {
    $('#account-body').css('visibility', 'visible');
    document.getElementById('uname').innerHTML = sessionStorage.getItem('name');
    document.getElementById('uid').innerHTML = sessionStorage.getItem('userid');
    document.getElementById('emailid').innerHTML = sessionStorage.getItem('email');
    document.getElementById('unum').innerHTML = sessionStorage.getItem('phone');
    document.getElementById('ac-name').innerHTML = sessionStorage.getItem('name');
  }
}
function resize() {
  if ($("#div1").height() > $("#div2").height()) {
    $("#div2").height($("#div1").height());
  }
  if ($("#div2").height() > $("#div1").height()) {
    $("#div1").height($("#div2").height());
  }
}
function callAPI() {
  $('#resultsection').hide()
  document.getElementById("type").innerHTML = "";
  document.getElementById("mean1").innerHTML = "";
  document.getElementById("mean2").innerHTML = "";
  document.getElementById("mean3").innerHTML = "";
  document.getElementById("mean4").innerHTML = "";
  document.getElementById("mean5").innerHTML = "";
  document.getElementById("mean6").innerHTML = "";
  document.getElementById("mean7").innerHTML = "";
  document.getElementById("mean8").innerHTML = "";
  document.getElementById("mean9").innerHTML = "";
  document.getElementById("mean10").innerHTML = "";
  var wordInput = document.getElementById("word").value;
  if (wordInput == "") {
    return;
  }
  var queryParam = {
    word: wordInput.toLowerCase(),
    sessionid: sessionStorage.getItem('sessionid'),
    userid: sessionStorage.getItem('userid')
  };
  $.get("http://localhost:5000/getDefinition", queryParam, function (data, status) {
    $('#resultsection').show();
    document.getElementById("wordsearch").innerHTML = wordInput;
    if (data.length > 0) {
      var count = 0;
      if (data[count] != undefined) { count++; document.getElementById("type").innerHTML = data[0].partOfSpeech; }
      if (data[count] != undefined) { count++; document.getElementById("mean1").innerHTML = "1. " + data[0].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean2").innerHTML = "2. " + data[1].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean3").innerHTML = "3. " + data[2].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean4").innerHTML = "4. " + data[3].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean5").innerHTML = "5. " + data[4].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean6").innerHTML = "6. " + data[5].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean7").innerHTML = "7. " + data[6].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean8").innerHTML = "8. " + data[7].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean9").innerHTML = "9. " + data[8].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean10").innerHTML = "10. " + data[9].text; }
      resize();
    }
    else {
      document.getElementById("type").innerHTML = "No data found in dictionary";
      resize();
    }
  });
  resize();
}
function fetchLearned() {
  $('#resultsectionLearn').hide();
  var res = document.getElementById("resultsectionLearn");
  res.innerHTML = "";
  var wordInput = document.getElementById("learned").value;
  if (wordInput == "") {
    return;
  }
  var queryParam = {
    word: wordInput.toLowerCase(),
    sessionid: sessionStorage.getItem('sessionid'),
    userid: sessionStorage.getItem('userid')
  };
  $.get("http://localhost:5000/getLearned", queryParam, function (data, status) {
    $('#resultsectionLearn').show();
    if (data.dataDictionary.length == 0) {
      res.innerHTML = "<a href='#' class='list-color-customized list-group-item list-group-item-action'>You have not searched any word with this pattern</a>";
      resize();
    }
    else {
      res.innerHTML = "<br/>";
      for (var i = 0; i < data.dataDictionary.length; i++) {
        var color = "gray";
        if (data.dataDictionary[i].count <= 2) {
          color = "gray";
        }
        if (data.dataDictionary[i].count > 2 && data.dataDictionary[i].count <= 5) {
          color = "yellow;color:gray;";
        }
        if (data.dataDictionary[i].count > 5) {
          color = "green";
        }
        res.innerHTML += "<a href='javascript:void(0);' onclick='callAPINew()' class='list-color-customized list-group-item list-group-item-action item-select'>" + data.dataDictionary[i].word + "<button class='learn-button' style='background-color:" + color + "'>" + data.dataDictionary[i].count + "</button></a>";
      }
      resize();
    }
  });
}
function callAPINew() {
  $('#resultsectionLearnSide').hide();
  document.getElementById("nodata").innerHTML = "";
  document.getElementById("type1").innerHTML = "";
  document.getElementById("mean11").innerHTML = "";
  document.getElementById("mean21").innerHTML = "";
  document.getElementById("mean31").innerHTML = "";
  document.getElementById("mean41").innerHTML = "";
  document.getElementById("mean51").innerHTML = "";
  document.getElementById("mean61").innerHTML = "";
  document.getElementById("mean71").innerHTML = "";
  document.getElementById("mean81").innerHTML = "";
  document.getElementById("mean91").innerHTML = "";
  document.getElementById("mean101").innerHTML = "";
  var str = event.currentTarget.innerText;
  var wordInput = str.replace(/[0-9]/g, '');
  if (wordInput == "") {
    return;
  }
  var queryParam = {
    word: wordInput.toLowerCase(),
    sessionid: sessionStorage.getItem('sessionid'),
    userid: sessionStorage.getItem('userid')
  };
  $.get("http://localhost:5000/getDefinition", queryParam, function (data, status) {
    $('#resultsectionLearnSide').show();
    document.getElementById("wordsearch1").innerHTML = queryParam.word;
    if (data.length > 0) {
      var count = 0;
      if (data[count] != undefined) { count++; document.getElementById("type1").innerHTML = data[0].partOfSpeech; }
      if (data[count] != undefined) { count++; document.getElementById("mean11").innerHTML = "1. " + data[0].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean21").innerHTML = "2. " + data[1].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean31").innerHTML = "3. " + data[2].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean41").innerHTML = "4. " + data[3].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean51").innerHTML = "5. " + data[4].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean61").innerHTML = "6. " + data[5].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean71").innerHTML = "7. " + data[6].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean81").innerHTML = "8. " + data[7].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean91").innerHTML = "9. " + data[8].text; }
      if (data[count] != undefined) { count++; document.getElementById("mean101").innerHTML = "10. " + data[9].text; }
      resize();
    }
    else {
      document.getElementById("type1").innerHTML = "No data found in dictionary";
      resize();
    }
  });
}
function logout() {
  var queryParam = {
    sessionid: sessionStorage.getItem('sessionid'),
    userid: sessionStorage.getItem('userid')
  };
  sessionStorage.clear();
  $.get("http://localhost:5000/logout", queryParam, function (data, status) {
    window.location.href = "http://localhost:5000/login/";
  });
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
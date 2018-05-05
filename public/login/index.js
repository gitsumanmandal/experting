function loginload() {
  if (sessionStorage.getItem('userid') != null) {
    window.location.href = "http://localhost:5000/view/";
  }
  else {
    $('#login-body').css('visibility', 'visible');
  }
}
function loginauth() {
  var userid = document.getElementById("uid").value;
  var passkey = document.getElementById("passkey").value;
  if (passkey == "" || userid == "") {
    return;
  }
  var queryParam = {
    userid: userid,
    passkey: passkey
  };
  $.get("http://localhost:5000/loginauth", queryParam, function (data, status) {
    if (data.status.response == "SUCCESS") {
      sessionStorage.setItem('userid', data.data['userid']);
      sessionStorage.setItem('email', data.data['email']);
      sessionStorage.setItem('name', data.data['name']);
      sessionStorage.setItem('phone', data.data['phone']);
      sessionStorage.setItem('sessionid', data.sessionid);
      window.location.href = "http://localhost:5000/view/";
    }
  });
}
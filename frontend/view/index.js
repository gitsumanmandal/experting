function callAPI(){
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
  var wordInput = document.getElementById("word").value;
  var queryParam = {
    word: wordInput.toLowerCase()
  };
  $.get("http://localhost:5000/getDefinition",queryParam, function(data, status){
    document.getElementById("wordsearch").innerHTML = wordInput;
    if(data.length > 0){
      document.getElementById("type").innerHTML = data[0].partOfSpeech;
      document.getElementById("mean1").innerHTML = "1. "+ data[0].text;
      document.getElementById("mean2").innerHTML = "2. "+ data[1].text;
      document.getElementById("mean3").innerHTML = "3. "+ data[2].text;
      document.getElementById("mean4").innerHTML = "4. "+ data[3].text;
      document.getElementById("mean5").innerHTML = "5. "+ data[4].text;
      document.getElementById("mean6").innerHTML = "6. "+ data[5].text;
      document.getElementById("mean7").innerHTML = "7. "+ data[6].text;
      document.getElementById("mean8").innerHTML = "8. "+ data[7].text;
      document.getElementById("mean9").innerHTML = "9. "+ data[8].text;
    }
    else{
      document.getElementById("type").innerHTML = "No data found in dictionary";
    }
  });
}

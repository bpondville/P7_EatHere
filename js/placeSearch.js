let reponse;
let requestPlace = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
    reponse = JSON.parse(this.responseText);
    console.log(reponse);
  }
};
let requestUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyDKJJxXADSpQI0s4NbC-bHlFWJKxeqwg5c';
requestPlace.open('GET', requestUrl);
requestPlace.send();
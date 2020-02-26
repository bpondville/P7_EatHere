let arrayRestos;

let request = new XMLHttpRequest();
let requestUrl = '../json/resto.json';
request.open('GET', requestUrl);
request.responseType = 'json';
request.send();
request.onload = function () { // A la réponse du serveur :
  arrayRestos = request.response;
  placeMarkers();
  creationListRestos();
}

const placeMarkers = () => {
  arrayRestos.forEach(resto => {
    let restoLatLng = {
      lat: resto.lat,
      lng: resto.long,
    }

    let markerPosResto = new google.maps.Marker({
      position: restoLatLng,
      map: map,
      icon: {
        url: '../images/posResto.svg',
        labelOrigin: new google.maps.Point(20, -8),
      },
      title: resto.restaurantName,
      label: {
        text: resto.restaurantName,
        fontSize: '14px',
        fontWeight: '500'
      }
    });
  });
}

const creationListRestos = () => {
  document.getElementById('container-fiches-restos').innerHTML = '';
  arrayRestos.forEach(resto => {
    let ficheResto = document.createElement('div');
    ficheResto.classList.add('fiche-resto');

    let h1NameResto = document.createElement('h1');
    h1NameResto.innerText = resto.restaurantName;

    let containerNote = document.createElement('div');
    containerNote.classList.add('container-note');

    let containerStars = document.createElement('div');
    containerStars.classList.add('container-stars');
    containerStars.insertAdjacentHTML('beforeend', '<img class="star" src="images/star.svg"><img class="star" src="images/star.svg"><img class="star" src="images/star.svg"><img class="star" src="images/star.svg"><img class="star" src="images/star.svg">');

    let noteTxt = document.createElement('p');
    noteTxt.classList.add('note-txt');

    let totalNote = 0;
    let nrbNote = 0;
    let moyenneNote = 0;

    resto.ratings.forEach(note => {
      totalNote += note.stars;
      nrbNote++;
      moyenneNote = totalNote / nrbNote;
    });

    noteTxt.insertAdjacentText('beforeend', moyenneNote + '/5')

    ficheResto.insertAdjacentElement('beforeend', h1NameResto);
    containerNote.insertAdjacentElement('beforeend', containerStars);
    containerNote.insertAdjacentElement('beforeend', noteTxt);
    ficheResto.insertAdjacentElement('beforeend', containerNote);

    document.getElementById('container-fiches-restos').insertAdjacentElement('beforeend', ficheResto);
  });
}
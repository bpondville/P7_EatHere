let arrayRestos, value1, value2;

let request = new XMLHttpRequest();
let requestUrl = '../json/resto.json';
request.open('GET', requestUrl);
request.responseType = 'json';
request.send();
request.onload = function () { // A la réponse du serveur :
  arrayRestos = request.response;
  getFiltre();
  placeMarkers();
  actualiseListResto();
}

let arrayMarkers = [];

const placeMarkers = () => {
  arrayMarkers.forEach(marker => {
    marker.setMap(null);
  });
  arrayRestos.forEach(resto => {
    let restoLatLng = {
      lat: resto.lat,
      lng: resto.long,
    }

    let totalNote = 0;
    let nrbNote = 0;
    let moyenneNote = 0;

    resto.ratings.forEach(note => {
      totalNote += note.stars;
      nrbNote++;
      moyenneNote = totalNote / nrbNote;
    });

    if ((moyenneNote >= value1 && moyenneNote <= value2) || (value1 == undefined && value2 == undefined)) {
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
      arrayMarkers.push(markerPosResto);
    }
  });

}

const getFiltre = () => {
  document.getElementById('filtre').addEventListener('click', function () {
    value1 = undefined;
    value2 = undefined;
    let arrayCheckboxChecked = document.querySelectorAll('.checkbox:checked');
    let arrayCheckbox = document.querySelectorAll('.checkbox');

    arrayCheckbox.forEach(checkbox => {
      checkbox.classList.remove('active-star');
    });

    if (arrayCheckboxChecked[0] !== undefined) {
      value1 = arrayCheckboxChecked[0].value;
    }

    if (arrayCheckboxChecked[1] !== undefined) {
      value2 = arrayCheckboxChecked[1].value;
    }

    if (arrayCheckboxChecked.length >= 2) {
      arrayCheckboxChecked.forEach(checkbox => {
        checkbox.checked = false;
      });
    }

    for (let i = value1; i <= value2; i++) {
      document.querySelectorAll('.checkbox')[i - 1].classList.add('active-star');
    }
    actualiseListResto();
    placeMarkers();
  });
}

const actualiseListResto = () => {
  document.getElementById('container-fiches-restos').innerHTML = '';
  arrayRestos.forEach(resto => {
    let totalNote = 0;
    let nrbNote = 0;
    let moyenneNote = 0;

    resto.ratings.forEach(note => {
      totalNote += note.stars;
      nrbNote++;
      moyenneNote = totalNote / nrbNote;
    });

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

    noteTxt.insertAdjacentText('beforeend', moyenneNote + '/5')

    ficheResto.insertAdjacentElement('beforeend', h1NameResto);
    containerNote.insertAdjacentElement('beforeend', containerStars);
    containerNote.insertAdjacentElement('beforeend', noteTxt);
    ficheResto.insertAdjacentElement('beforeend', containerNote);

    if ((moyenneNote >= value1 && moyenneNote <= value2) || (value1 == undefined && value2 == undefined)) {
      document.getElementById('container-fiches-restos').insertAdjacentElement('beforeend', ficheResto);
    }

  });
}
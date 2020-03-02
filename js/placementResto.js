let arrayRestos, value1, value2, markerPosResto;
let arrayMarkers = [];

let request = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
    arrayRestos = JSON.parse(this.responseText);
    getFiltre();
    placementRestos();
  }
};
let requestUrl = '../json/resto.json';
request.open('GET', requestUrl);
request.send();

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
    placementRestos();
  });
}

const placementRestos = () => {
  document.getElementById('container-fiches-restos').innerHTML = '';
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


    // PLACEMENT DES MARKERS
    resto.ratings.forEach(note => {
      totalNote += note.stars;
      nrbNote++;
      moyenneNote = totalNote / nrbNote;
    });

    if ((moyenneNote >= value1 && moyenneNote <= value2) || (value1 == undefined && value2 == undefined)) {
      markerPosResto = new google.maps.Marker({
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

    let ficheResto = document.createElement('div');
    ficheResto.classList.add('fiche-resto');

    let h1NameResto = document.createElement('h1');
    h1NameResto.innerText = resto.restaurantName;

    let containerNote = document.createElement('div');
    containerNote.classList.add('container-note');

    let containerStars = document.createElement('div');
    containerStars.classList.add('container-stars');
    containerStars.style.width = (moyenneNote * 115 / 5) + 'px';
    containerStars.insertAdjacentHTML('beforeend', '<img class="star" src="images/moyenne.svg">');

    let noteTxt = document.createElement('p');
    noteTxt.classList.add('note-txt');

    if (Number.isInteger(moyenneNote)) {
      noteTxt.insertAdjacentText('beforeend', moyenneNote + '/5');
    } else {
      noteTxt.insertAdjacentText('beforeend', moyenneNote.toFixed(1) + '/5');
    }

    containerNote.insertAdjacentElement('beforeend', containerStars);
    containerNote.insertAdjacentElement('beforeend', noteTxt);
    ficheResto.insertAdjacentElement('beforeend', h1NameResto);
    ficheResto.insertAdjacentElement('beforeend', containerNote);

    if ((moyenneNote >= value1 && moyenneNote <= value2) || (value1 == undefined && value2 == undefined)) {
      document.getElementById('container-fiches-restos').insertAdjacentElement('beforeend', ficheResto);
    }

    ficheResto.addEventListener('click', function () {
      let allApercuBaliseImg = document.querySelectorAll('.apercuStreetView');
      allApercuBaliseImg.forEach(img => {
        img.remove();
      });

      let allExpandContainer = document.querySelectorAll('.expand-container');
      allExpandContainer.forEach(expand => {
        expand.remove();
      });

      let apercuStreetView = document.createElement('img');
      apercuStreetView.classList.add('apercuStreetView');
      ficheResto.insertAdjacentElement('afterbegin', apercuStreetView);
      let urlApercu = 'https://maps.googleapis.com/maps/api/streetview?size=240x150&location=' + restoLatLng.lat + ',' + restoLatLng.lng + '&source=outdoor&pitch=0&key=AIzaSyDKJJxXADSpQI0s4NbC-bHlFWJKxeqwg5c';
      apercuStreetView.src = urlApercu;
      apercuStreetView.style.height = '150px';

      let expandContainer = document.createElement('div');
      expandContainer.classList.add('expand-container');

      let adresse = document.createElement('p');
      adresse.classList.add('adresse');
      adresse.innerText = resto.address;
      expandContainer.insertAdjacentElement('beforeend', adresse);

      resto.ratings.forEach(avis => {

        let note = document.createElement('p');
        note.classList.add('note-avis');
        note.innerText = avis.stars + '/5';

        let comment = document.createElement('p');
        comment.classList.add('comment');
        comment.innerText = avis.comment;

        expandContainer.insertAdjacentElement('beforeend', note);
        expandContainer.insertAdjacentElement('beforeend', comment);
      });

      ficheResto.insertAdjacentElement('beforeend', expandContainer);

    });
  });
}
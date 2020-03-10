let arrayRestos, value1, value2, markerPosResto;
let arrayMarkers = [];


/* --- RECUPERATION DU JSON --- */
let request = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
    arrayRestos = JSON.parse(this.responseText);
    transformIntoClass(arrayRestos);
    getFiltre();
    insertFiches();
  }
};
let requestUrl = '../json/resto.json';
request.open('GET', requestUrl);
request.send();

let newArrayRestos = [];

const transformIntoClass = (tableau) => {
  for (let i = 0; i < tableau.length; i++) {
    let resto = new Resto('resto' + i, arrayRestos[i].restaurantName, arrayRestos[i].address, arrayRestos[i].lat, arrayRestos[i].long, arrayRestos[i].ratings);
    newArrayRestos.push(resto);
  }
}

const insertFiches = () => {
  document.getElementById('container-fiches-restos').innerHTML = '';
  arrayMarkers.forEach(marker => { // On retire tous les markers
    marker.setMap(null);
  });
  arrayMarkers = [];


  newArrayRestos.forEach(resto => {
    resto.moyenneAvis();
    resto.createFiche();
    resto.placeMarker();
  });
}

/* --- CREATION DU FILTRE --- */
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
      arrayCheckbox[i - 1].classList.add('active-star');
    }
    insertFiches();
  });
}

/* --- FONCTION DE PLACEMENT DES RESTAURANTS --- */

const placeNewResto = (latLng) => {
  let restoName = prompt('Nom restaurant', '');
  if (restoName == null || restoName == "") {
    alert("Aucun nom de restaurant n'a été saisi.");
  } else {
    let restoAdresse = prompt('Adresse du restaurant', '');
    if (restoAdresse == null || restoAdresse == "") {
      alert("Aucune adresse de restaurant n'a été saisie.");
    } else {
      let newResto = {
        "restaurantName": restoName,
        "address": restoAdresse,
        "lat": latLng.lat(),
        "long": latLng.lng(),
        "ratings": []
      }

      let idNewResto = newArrayRestos.length;
      let resto = new Resto('resto' + idNewResto, restoName, restoAdresse, latLng.lat(), latLng.lng(), []);
      newArrayRestos.push(resto);
      console.log(newArrayRestos);
      insertFiches();
    }
  }
}
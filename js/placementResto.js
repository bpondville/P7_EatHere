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

/* const functionSendComment = (restoId) => {
  let commentTxtObject = document.getElementsByName(restoId)[0];
  let note;
  let arrayCommentNote = document.querySelectorAll('.checkbox-add-avis');

  arrayCommentNote.forEach(radio => {
    if (radio.checked) {
      note = parseInt(radio.value);
    }
  });

  let avis = {
    "stars": note,
    "comment": commentTxtObject.value
  }

  if (avis.stars !== undefined && avis.comment !== '') {
    arrayRestos[restoId].ratings.push(avis);

    placementRestos();

  } else if (avis.stars == undefined) {
    alert('Veuillez renseigner une note grace au système d\'étoiles');
  } else if (avis.comment == '') {
    alert('Veuillez ajouter un commentaire');
  }
}

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
      arrayRestos.push(newResto);
      addIdResto();
      placementRestos();
    }
  }
} */
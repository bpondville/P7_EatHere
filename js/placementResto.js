let arrayRestos, value1, value2, markerPosResto;
let arrayMarkers = [];


/* --- RECUPERATION DU JSON --- */
let request = new XMLHttpRequest();
request.onreadystatechange = function () {
  if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
    arrayRestos = JSON.parse(this.responseText);
    addIdResto();
    getFiltre();
    placementRestos();
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
    placementRestos();
  });
}

const addIdResto = () => {
  id = 0;
  arrayRestos.forEach(resto => {
    resto.id = id;
    id++;
  });
}


/* --- FONCTION DE PLACEMENT DES RESTAURANTS --- */
const placementRestos = () => {
  document.getElementById('container-fiches-restos').innerHTML = '';
  arrayMarkers.forEach(marker => { // On retire tous les markers
    marker.setMap(null);
  });

  arrayRestos.forEach(resto => {
    let restoLatLng = {
      lat: resto.lat,
      lng: resto.long,
    };

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
    ficheResto.id = 'fiche-resto' + resto.id;

    let basicInfo = document.createElement('div');
    basicInfo.classList.add('basic-info');

    let h1NameResto = document.createElement('h1');
    h1NameResto.innerText = resto.restaurantName;

    let containerNote = document.createElement('div');
    containerNote.classList.add('container-note');

    let moyenneStars = document.createElement('div');
    moyenneStars.classList.add('moyenne-stars');
    moyenneStars.style.width = (moyenneNote * 115 / 5) + 'px';
    moyenneStars.insertAdjacentHTML('beforeend', '<img class="star" src="images/moyenne.svg">');

    let noteTxt = document.createElement('p');
    noteTxt.classList.add('note-txt');

    if (Number.isInteger(moyenneNote)) { // Si c'est un entier
      noteTxt.insertAdjacentText('beforeend', moyenneNote + '/5'); // On l'insère directement
    } else {
      noteTxt.insertAdjacentText('beforeend', moyenneNote.toFixed(1) + '/5'); // Sinon on arrondi à 1 chiffre après la virgule
    }

    containerNote.insertAdjacentElement('beforeend', moyenneStars);
    containerNote.insertAdjacentElement('beforeend', noteTxt);
    basicInfo.insertAdjacentElement('beforeend', h1NameResto);
    basicInfo.insertAdjacentElement('beforeend', containerNote);
    ficheResto.insertAdjacentElement('beforeend', basicInfo);

    if ((moyenneNote >= value1 && moyenneNote <= value2) || (value1 == undefined && value2 == undefined)) {
      document.getElementById('container-fiches-restos').insertAdjacentElement('beforeend', ficheResto);
    }

    const expand = () => {
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

      if (resto.ratings.length !== null) {
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
      } 

      let addNote = document.createElement('div');
        addNote.classList.add('add-note');
        for (let i = 1; i <= 5; i++) {
          let addNoteContainerStars = document.createElement('div');
          addNoteContainerStars.classList.add('container-star');
          let input = document.createElement('input');
          input.setAttribute('class', 'checkbox-add-avis');
          input.setAttribute('type', 'radio');
          input.setAttribute('name', 'note');
          input.setAttribute('value', i);
          let span = document.createElement('span');
          span.classList.add('checkmark-filtre-add-avis');
          addNoteContainerStars.insertAdjacentElement('beforeend', input);
          addNoteContainerStars.insertAdjacentElement('beforeend', span);
          addNote.insertAdjacentElement('beforeend', addNoteContainerStars);
        }

        let addComment = document.createElement('textarea');
        addComment.setAttribute('maxlength', '255');
        addComment.setAttribute('placeholder', 'Donnez nous votre avis...');
        addComment.setAttribute('name', resto.id);
        addComment.classList.add('add-comment');

        let sendComment = document.createElement('input');
        sendComment.classList.add('send-comment');
        sendComment.setAttribute('type', 'button');
        sendComment.setAttribute('value', 'Envoyer');
        sendComment.setAttribute('onclick', 'functionSendComment(' + resto.id + ')');

        let addCommentContainer = document.createElement('div');
        addCommentContainer.classList.add('add-comment-container');

        addCommentContainer.insertAdjacentElement('beforeend', addNote);
        addCommentContainer.insertAdjacentElement('beforeend', addComment);
        addCommentContainer.insertAdjacentElement('beforeend', sendComment);

      expandContainer.insertAdjacentElement('beforeend', addCommentContainer);

      ficheResto.insertAdjacentElement('beforeend', expandContainer);

      if ((moyenneNote >= value1 && moyenneNote <= value2) || (value1 == undefined && value2 == undefined)) { // On remonte le resto cliqué en première place
        document.getElementById('container-fiches-restos').insertAdjacentElement('afterbegin', ficheResto);
      }
    }

    // PLACEMENT DES MARKERS
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

    basicInfo.addEventListener('click', expand);
    markerPosResto.addListener('click', expand);
  });
}

const functionSendComment = (restoId) => {
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

const placeNewResto = (latLng) =>  {
  let restoName = prompt('Nom restaurant', '');
  if (restoName == null || restoName == "") {
    alert("Champ invalide");
  } else {
    let restoAdresse = prompt('Adresse du restaurant', '');
    let newResto = {
      "restaurantName": restoName,
      "address": restoAdresse,
      "lat": latLng.lat(),
      "long": latLng.lng(),
      "ratings": []
    }
    arrayRestos.push(newResto);
    placementRestos();
    addIdResto();
  }
}
class ficheResto {
  constructor(id, name, address, posLat, posLong, avis) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.lat = posLat;
    this.long = posLong;
    this.posLatLng = {
      lat: posLat,
      lng: posLong
    };
    this.avis = avis;
  }

  moyenneAvis() {
    let totalNote = 0;
    let nbrNote = 0;
    let moyenne;
    this.avis.forEach(avis => {
      totalNote += avis.stars;
      nbrNote++;
    });
    moyenne = totalNote / nbrNote;

    if (Number.isInteger(moyenne)) {
      this.moyenne = moyenne;
    } else {
      this.moyenne = moyenne.toFixed(1);
    }
  }

  createFiche() {
    let ficheResto = document.createElement('div');
    ficheResto.classList.add('fiche-resto');
    ficheResto.id = 'fiche-resto' + this.id;

    let basicInfo = document.createElement('div');
    basicInfo.classList.add('basic-info');

    let h1 = document.createElement('h1');
    h1.innerText = this.name;

    let containerNote = document.createElement('div');
    containerNote.classList.add('container-note');

    let moyenneStars = document.createElement('div');
    moyenneStars.classList.add('moyenne-stars');
    moyenneStars.style.width = (this.moyenne * 115 / 5) + 'px';
    moyenneStars.insertAdjacentHTML('beforeend', '<img class="star" src="images/moyenne.svg">');

    let noteTxt = document.createElement('p');
    noteTxt.classList.add('note-txt');

    containerNote.insertAdjacentElement('beforeend', moyenneStars);
    containerNote.insertAdjacentElement('beforeend', noteTxt);
    basicInfo.insertAdjacentElement('beforeend', h1);
    basicInfo.insertAdjacentElement('beforeend', containerNote);
    ficheResto.insertAdjacentElement('beforeend', basicInfo);

    if ((this.moyenne >= value1 && this.moyenne <= value2) || (value1 == undefined && value2 == undefined)) {
      document.getElementById('container-fiches-restos').insertAdjacentElement('beforeend', ficheResto);
    }

     // basicInfo.addEventListener('click', this.expandFiche);

  }

  expandFiche() {
    let allApercuBaliseImg = document.querySelectorAll('.apercuStreetView');
    allApercuBaliseImg.forEach(img => {
      img.remove();
    });

    let allExpandContainer = document.querySelectorAll('.expand-container');
    allExpandContainer.forEach(expand => {
      expand.remove();
    });

    let ficheResto = document.getElementById('fiche-resto' + this.id);
    console.log(ficheResto);

    let apercuStreetView = document.createElement('img');
    apercuStreetView.classList.add('apercuStreetView');
    ficheResto.insertAdjacentElement('afterbegin', apercuStreetView);
    let urlApercu = 'https://maps.googleapis.com/maps/api/streetview?size=240x150&location=' + this.lat + ',' + this.long + '&source=outdoor&pitch=0&key=AIzaSyDKJJxXADSpQI0s4NbC-bHlFWJKxeqwg5c';
    apercuStreetView.src = urlApercu;
    apercuStreetView.style.height = '150px';

    let expandContainer = document.createElement('div');
    expandContainer.classList.add('expand-container');

    let adresse = document.createElement('p');
    adresse.classList.add('adresse');
    adresse.innerText = this.address;
    expandContainer.insertAdjacentElement('beforeend', adresse);

    if (this.avis.length !== null) {
      this.avis.forEach(avis => {

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
    addComment.setAttribute('name', this.id);
    addComment.classList.add('add-comment');

    let sendComment = document.createElement('input');
    sendComment.classList.add('send-comment');
    sendComment.setAttribute('type', 'button');
    sendComment.setAttribute('value', 'Envoyer');
    sendComment.setAttribute('onclick', 'functionSendComment(' + this.id + ')');

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
}

let newArrayRestos = [];

const transformIntoClass = (tableau) => {
  for (let i = 0; i < tableau.length; i++) {
    let resto = new ficheResto('resto' + i, arrayRestos[i].restaurantName, arrayRestos[i].address, arrayRestos[i].lat, arrayRestos[i].long, arrayRestos[i].ratings);
    newArrayRestos.push(resto);
  }
}

const insertFiches = () => {
  document.getElementById('container-fiches-restos').innerHTML = '';
  arrayMarkers.forEach(marker => { // On retire tous les markers
    marker.setMap(null);
  });


  newArrayRestos.forEach(resto => {
    resto.moyenneAvis();
    resto.createFiche();
  })
}
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 48.875044,
      lng: 2.350477
    },
    zoom: 14,
    fullscreenControl: false,
    styles: [{
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
            "saturation": -35
          },
          {
            "lightness": 30
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#eb4d4d"
          },
          {
            "lightness": 85
          }
        ]
      },
      {
        "featureType": "poi.attraction",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.business",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.government",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.medical",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.place_of_worship",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.school",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.sports_complex",
        "stylers": [{
          "visibility": "off"
        }]
      }
    ]
  });

  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      let posForMarkerCurrentPosition = {
        lat: pos.lat,
        lng: pos.lng
      };

      let markerCurrentPosition = new google.maps.Marker({
        position: posForMarkerCurrentPosition,
        map: map,
        icon: '../images/posClient.svg'
      });

      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Erreur: La géolocalisation a échouée.' :
    'Erreur: Votre navigateur ne supporte pas la géolocalisation');
  infoWindow.open(map);
}
let map, directionsService, directionsRenderer, markers = [];

function initMap() {
    const cabinetLocation = { lat: 48.8544, lng: 2.3624 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: cabinetLocation,
        mapId: '621203c87004e484'
    });

    const marker = new google.maps.Marker({
        position: cabinetLocation,
        map: map,
        title: 'Cabinet Dentaire Docteur Anthony',
        animation: google.maps.Animation.BOUNCE
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            const userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Votre position',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff'
                }
            });
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(cabinetLocation);
            bounds.extend(userLocation);
            map.fitBounds(bounds);

            directionsService.route({
                origin: userLocation,
                destination: cabinetLocation,
                travelMode: google.maps.TravelMode.DRIVING
            }, (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                    displayTravelTimes(userLocation, cabinetLocation);
                } else {
                    console.log('La demande de directions a échoué en raison de ' + status);
                }
            });
        }, () => handleLocationError(true, map.getCenter()));
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function displayTravelTimes(origin, destination) {
    const travelModes = [google.maps.TravelMode.DRIVING, google.maps.TravelMode.WALKING, google.maps.TravelMode.BICYCLING, google.maps.TravelMode.TRANSIT];
    const travelTimesContainer = document.getElementById('travel-times');

    travelTimesContainer.innerHTML = '<h3>Temps de trajet estimé</h3>';

    travelModes.forEach(mode => {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: mode
        }, (response, status) => {
            if (status === 'OK') {
                const duration = response.routes[0].legs[0].duration.text;
                const modeText = getModeText(mode);
                const travelTimeElement = document.createElement('p');
                travelTimeElement.textContent = `En ${modeText}: ${duration}`;
                travelTimesContainer.appendChild(travelTimeElement);
            } else {
                console.log('Directions request failed due to ' + status);
            }
        });
    });
}

function getModeText(mode) {
    switch (mode) {
        case google.maps.TravelMode.DRIVING:
            return 'voiture';
        case google.maps.TravelMode.WALKING:
            return 'marche';
        case google.maps.TravelMode.BICYCLING:
            return 'vélo';
        case google.maps.TravelMode.TRANSIT:
            return 'transport en commun';
        default:
            return 'mode inconnu';
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    console.log(browserHasGeolocation ?
        'Erreur : Le service de géolocalisation a échoué.' :
        'Erreur : Votre navigateur ne supporte pas la géolocalisation.');
}

function showPlaces(type) {
    clearMarkers();
    const cabinetLocation = { lat: 48.8544, lng: 2.3624 };
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: cabinetLocation,
        radius: 1000,
        type: [type]
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    });
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });

    const infowindow = new google.maps.InfoWindow({
        content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`
    });

    marker.addListener('click', () => {
        infowindow.open(map, marker);
        calculateRouteTo(place.geometry.location);
    });

    markers.push(marker);
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function calculateRouteTo(destination) {
    const cabinetLocation = { lat: 48.8544, lng: 2.3624 };
    directionsService.route({
        origin: cabinetLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING
    }, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            console.log('Directions request failed due to ' + status);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const dentalTips = [
        "Brossez-vous les dents deux fois par jour avec un dentifrice fluoré.",
        "Utilisez la soie dentaire quotidiennement pour éliminer la plaque entre les dents.",
        "Évitez les aliments et les boissons sucrés pour prévenir les caries.",
        "Visitez votre dentiste régulièrement pour des examens et des nettoyages.",
        "Utilisez un bain de bouche antibactérien pour réduire la plaque et prévenir les maladies des gencives.",
        "Remplacez votre brosse à dents tous les trois mois ou plus tôt si les poils sont usés.",
        "Mâchez du chewing-gum sans sucre pour stimuler la production de salive.",
        "Buvez beaucoup d'eau pour garder votre bouche hydratée et éliminer les débris alimentaires.",
        "Évitez de fumer, car le tabac peut causer des maladies des gencives et des cancers de la bouche.",
        "Portez un protège-dents si vous pratiquez des sports de contact pour protéger vos dents."
    ];

    const tipContainer = document.getElementById('tip-container');
    let currentTipIndex = 0;

    function showNextTip() {
        tipContainer.textContent = '';
        const tip = document.createElement('p');
        tip.textContent = dentalTips[currentTipIndex];
        tipContainer.appendChild(tip);
        currentTipIndex = (currentTipIndex + 1) % dentalTips.length;
        setTimeout(showNextTip, 5000);
    }

    showNextTip();

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const faqCategoryLinks = document.querySelectorAll('.faq-category-link');
    const faqCategories = document.querySelectorAll('.faq-category');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.toggle('hidden', section.id !== targetId);
            });
        });
    });

    faqCategoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            faqCategories.forEach(category => {
                category.classList.toggle('hidden', category.id !== targetId);
            });
        });
    });

    initMap();
});

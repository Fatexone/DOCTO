function initMap() {
    const cabinetLocation = { lat: 48.8544, lng: 2.3624 }; // Coordonnées de 19 Rue Saint-Antoine, 75004 Paris

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: cabinetLocation,
        mapId: 'YOUR_MAP_ID' // Remplacez 'YOUR_MAP_ID' par votre Map ID
    });

    // Ajouter un marqueur pour la localisation du cabinet
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: cabinetLocation,
            map: map,
            title: 'Cabinet Dentaire Docteur Anthony'
        });
    } else {
        const marker = new google.maps.Marker({
            position: cabinetLocation,
            map: map,
            title: 'Cabinet Dentaire Docteur Anthony'
        });
    }

    // Directions service and renderer
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Utiliser la géolocalisation pour obtenir la position de l'utilisateur
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Ajouter un marqueur pour la position de l'utilisateur
            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
                const userMarker = new google.maps.marker.AdvancedMarkerElement({
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
            } else {
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
            }

            // Recentrer la carte pour inclure la position du cabinet et celle de l'utilisateur
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(cabinetLocation);
            bounds.extend(userLocation);
            map.fitBounds(bounds);

            // Tracer l'itinéraire de l'utilisateur au cabinet
            directionsService.route(
                {
                    origin: userLocation,
                    destination: cabinetLocation,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (response, status) => {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(response);
                        displayTravelTimes(userLocation, cabinetLocation);
                    } else {
                        console.log('La demande de directions a échoué en raison de ' + status);
                    }
                }
            );

        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Le navigateur ne supporte pas la géolocalisation
        handleLocationError(false, map.getCenter());
    }
}

function displayTravelTimes(origin, destination) {
    const travelModes = [google.maps.TravelMode.DRIVING, google.maps.TravelMode.WALKING, google.maps.TravelMode.BICYCLING, google.maps.TravelMode.TRANSIT];
    const travelTimesContainer = document.getElementById('travel-times');

    travelTimesContainer.innerHTML = '<h3>Temps de trajet estimé</h3>';

    travelModes.forEach(mode => {
        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: mode
            },
            (response, status) => {
                if (status === 'OK') {
                    const duration = response.routes[0].legs[0].duration.text;
                    const modeText = getModeText(mode);
                    const travelTimeElement = document.createElement('p');
                    travelTimeElement.textContent = `En ${modeText}: ${duration}`;
                    travelTimesContainer.appendChild(travelTimeElement);
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            }
        );
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

document.addEventListener('DOMContentLoaded', () => {
    // Vos conseils dentaires
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
        // Efface le contenu précédent
        tipContainer.textContent = '';

        // Affiche le prochain conseil
        const tip = document.createElement('p');
        tip.textContent = dentalTips[currentTipIndex];
        tipContainer.appendChild(tip);

        // Met à jour l'index pour le prochain conseil
        currentTipIndex = (currentTipIndex + 1) % dentalTips.length;

        // Définit un délai avant de montrer le prochain conseil
        setTimeout(showNextTip, 5000); // Change de conseil toutes les 5 secondes
    }

    // Démarre l'affichage des conseils
    showNextTip();

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const faqCategoryLinks = document.querySelectorAll('.faq-category-link');
    const faqCategories = document.querySelectorAll('.faq-category');

    // Navigation entre sections
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.toggle('hidden', section.id !== targetId);
            });
        });
    });

    // Affichage des catégories de la FAQ
    faqCategoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            faqCategories.forEach(category => {
                category.classList.toggle('hidden', category.id !== targetId);
            });
        });
    });

    // Initialiser la carte
    initMap();
});

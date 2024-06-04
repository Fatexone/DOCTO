function initMap() {
    const cabinetLocation = { lat: 48.8544, lng: 2.3624 }; // Coordonnées de 19 Rue Saint-Antoine, 75004 Paris

    // Créer la carte centrée sur la localisation du cabinet
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: cabinetLocation
    });

    // Ajouter un marqueur pour la localisation du cabinet
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: cabinetLocation,
        map: map,
        title: 'Cabinet Dentaire Docteur Anthony'
    });

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

function handleLocationError(browserHasGeolocation, pos) {
    console.log(browserHasGeolocation ?
                'Erreur : Le service de géolocalisation a échoué.' :
                'Erreur : Votre navigateur ne supporte pas la géolocalisation.');
}

document.addEventListener('DOMContentLoaded', () => {
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
});

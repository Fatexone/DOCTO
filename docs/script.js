function initMap() {
    const cabinetLocation = { lat: 48.8544, lng: 2.3624 }; // Coordonnées de 19 Rue Saint-Antoine, 75004 Paris

    // Créer la carte centrée sur la localisation du cabinet
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: cabinetLocation
    });

    // Ajouter un marqueur pour la localisation du cabinet
    const marker = new google.maps.Marker({
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
                        console.log('Directions request failed due to ' + status);
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
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    // Affichage des catégories de la FAQ
    faqCategoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            faqCategories.forEach(category => {
                if (category.id === targetId) {
                    category.classList.remove('hidden');
                } else {
                    category.classList.add('hidden');
                }
            });
        });
    });

    // Gestion du formulaire de rendez-vous
    const appointmentForm = document.getElementById('appointment-form');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');

    if (dateInput) {
        dateInput.addEventListener('change', () => {
            const selectedDate = dateInput.value;
            fetch('https://vercel-f5mcyqjpb-fatexones-projects.vercel.app/available-slots')
                .then(response => response.json())
                .then(slots => {
                    const availableTimes = slots.find(slot => slot.date === selectedDate);
                    timeSelect.innerHTML = ''; // Réinitialiser les options
                    if (availableTimes) {
                        availableTimes.times.forEach(time => {
                            const option = document.createElement('option');
                            option.value = time;
                            option.textContent = time;
                            timeSelect.appendChild(option);
                        });
                    } else {
                        const option = document.createElement('option');
                        option.value = '';
                        option.textContent = 'Aucun créneau disponible';
                        timeSelect.appendChild(option);
                    }
                });
        });
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const needs = document.getElementById('needs').value;

            const appointmentDetails = {
                name,
                email,
                phone,
                date,
                time,
                needs
            };

            fetch('https://vercel-f5mcyqjpb-fatexones-projects.vercel.app/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentDetails)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Votre rendez-vous a été pris avec succès !');
                appointmentForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    // Initialiser la carte
    initMap();
});

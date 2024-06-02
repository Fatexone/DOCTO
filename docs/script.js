document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const faqCategoryLinks = document.querySelectorAll('.faq-category-link');
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item h4');

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

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const content = item.nextElementSibling;
            content.classList.toggle('hidden');
        });
    });

    const appointmentForm = document.getElementById('appointment-form');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');

    // Charger les créneaux disponibles lorsqu'une date est sélectionnée
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
});

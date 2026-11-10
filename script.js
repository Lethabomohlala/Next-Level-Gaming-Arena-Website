document.addEventListener('DOMContentLoaded', () => {

    /* --- Offers Page Category Filter --- */
    window.filterOffers = function(category, event) {
        const pkgsSection = document.getElementById('packages-section');
        const expSection = document.getElementById('experiences-section');
        const buttons = document.querySelectorAll('.filter-btn');

        buttons.forEach(btn => btn.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }

        if (category === 'all') {
            if (pkgsSection) pkgsSection.style.display = 'block';
            if (expSection) expSection.style.display = 'block';
        } else if (category === 'packages') {
            if (pkgsSection) pkgsSection.style.display = 'block';
            if (expSection) expSection.style.display = 'none';
        } else if (category === 'experiences') {
            if (pkgsSection) pkgsSection.style.display = 'none';
            if (expSection) expSection.style.display = 'block';
        }
    };

    /* --- Booking Page Logic --- */
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        let currentGuests = 1;
        const guestCountDisplay = document.getElementById('guestCount');
        const decBtn = document.getElementById('decrementBtn');
        const incBtn = document.getElementById('incrementBtn');

        if (decBtn && incBtn && guestCountDisplay) {
            decBtn.addEventListener('click', () => {
                if (currentGuests > 1) {
                    currentGuests--;
                    guestCountDisplay.textContent = currentGuests;
                }
            });

            incBtn.addEventListener('click', () => {
                currentGuests++;
                guestCountDisplay.textContent = currentGuests;
            });
        }

        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');

        function isValidEmail(val) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            if (fullName.value.trim() === '') {
                fullName.classList.add('error');
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            } else {
                fullName.classList.remove('error');
                document.getElementById('nameError').style.display = 'none';
            }

            if (!isValidEmail(email.value.trim())) {
                email.classList.add('error');
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            } else {
                email.classList.remove('error');
                document.getElementById('emailError').style.display = 'none';
            }

            if (phone.value.trim().length < 7) {
                phone.classList.add('error');
                document.getElementById('phoneError').style.display = 'block';
                isValid = false;
            } else {
                phone.classList.remove('error');
                document.getElementById('phoneError').style.display = 'none';
            }

            if (isValid) {
                const selectedPackages = [];
                document.querySelectorAll('input[name="pkg"]:checked').forEach(cb => {
                    selectedPackages.push({ name: cb.value, price: parseInt(cb.dataset.price) });
                });

                if (selectedPackages.length === 0) {
                    alert('Please select at least one package or experience to proceed.');
                    return;
                }

                localStorage.setItem('selectedPackages', JSON.stringify(selectedPackages));
                localStorage.setItem('clientName', fullName.value.trim());
                localStorage.setItem('guestCount', currentGuests);

                window.location.href = 'fees.html';
            }
        });
    }

    /* --- Fees Page Calculation --- */
    const tbody = document.getElementById('selectedItemsBody');
    if (tbody) {
        const savedPackages = JSON.parse(localStorage.getItem('selectedPackages')) || [
            { name: 'ULTIMATE GAMER PASS', price: 1500 },
            { name: 'ESPORTS TRAINING', price: 1500 },
            { name: 'ESCAPE ROOM CHALLENGE', price: 750 }
        ];

        let subtotal = 0;
        savedPackages.forEach(pkg => {
            subtotal += pkg.price;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${pkg.name}</td><td style="text-align: right;">R ${pkg.price.toLocaleString()}</td>`;
            tbody.appendChild(tr);
        });

        const count = savedPackages.length;
        let discountPercent = 0;
        if (count === 2) discountPercent = 5;
        else if (count === 3) discountPercent = 10;
        else if (count > 3) discountPercent = 15;

        const discountAmount = (subtotal * discountPercent) / 100;
        const discountedTotal = subtotal - discountAmount;
        const vat = discountedTotal * 0.15;
        const finalCost = discountedTotal + vat;

        document.getElementById('subtotalCell').innerHTML = `<strong>R ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>`;
        document.getElementById('discountLabel').textContent = `Discount (${discountPercent}% - ${count} Bookings)`;
        document.getElementById('discountCell').textContent = `-R ${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('discountedTotalCell').innerHTML = `<strong>R ${discountedTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>`;
        document.getElementById('afterDiscountCell').textContent = `R ${discountedTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('vatCell').textContent = `R ${vat.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('finalCostCell').innerHTML = `<strong>R ${finalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>`;
    }

    /* --- Confirmation Page Display --- */
    const clientNameDisplay = document.getElementById('clientNameDisplay');
    if (clientNameDisplay) {
        const clientName = localStorage.getItem('clientName') || 'Valued Gamer';
        const guestCount = localStorage.getItem('guestCount') || '1';
        const savedPackages = JSON.parse(localStorage.getItem('selectedPackages')) || [
            { name: 'ULTIMATE GAMER PASS', price: 1500 },
            { name: 'ESPORTS TRAINING', price: 1500 },
            { name: 'ESCAPE ROOM CHALLENGE', price: 750 }
        ];

        clientNameDisplay.textContent = clientName;
        document.getElementById('guestCountDisplay').textContent = guestCount;
        document.getElementById('confirmSubtitle').textContent = `Thank you, ${clientName}! Your session for ${guestCount} guest(s) has been successfully secured.`;

        let subtotal = 0;
        const packageNames = [];

        savedPackages.forEach(pkg => {
            subtotal += pkg.price;
            packageNames.push(pkg.name);
        });

        document.getElementById('packagesDisplay').textContent = packageNames.join(', ');

        const count = savedPackages.length;
        let discountPercent = 0;
        if (count === 2) discountPercent = 5;
        else if (count === 3) discountPercent = 10;
        else if (count > 3) discountPercent = 15;

        const discountAmount = (subtotal * discountPercent) / 100;
        const discountedTotal = subtotal - discountAmount;
        const vat = discountedTotal * 0.15;
        const finalCost = discountedTotal + vat;

        document.getElementById('subtotalDisplay').textContent = `R ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('discountTextLabel').textContent = `Discount applied (${discountPercent}%):`;
        document.getElementById('discountDisplay').textContent = `-R ${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('vatDisplay').textContent = `R ${vat.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('finalDisplay').textContent = `R ${finalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    /* --- Contact Page Form Validation & Session Handling --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const contactName = document.getElementById('contactName');
        const contactEmail = document.getElementById('contactEmail');
        const contactMessage = document.getElementById('contactMessage');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const successBanner = document.getElementById('successBanner');

        function isValidEmail(val) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            if (contactName.value.trim() === '') {
                contactName.classList.add('error');
                nameError.style.display = 'block';
                isValid = false;
            } else {
                contactName.classList.remove('error');
                nameError.style.display = 'none';
            }

            if (!isValidEmail(contactEmail.value.trim())) {
                contactEmail.classList.add('error');
                emailError.style.display = 'block';
                isValid = false;
            } else {
                contactEmail.classList.remove('error');
                emailError.style.display = 'none';
            }

            if (contactMessage.value.trim() === '') {
                contactMessage.classList.add('error');
                messageError.style.display = 'block';
                isValid = false;
            } else {
                contactMessage.classList.remove('error');
                messageError.style.display = 'none';
            }

            if (isValid) {
                successBanner.style.display = 'block';
                contactForm.reset();
                setTimeout(() => {
                    successBanner.style.display = 'none';
                }, 5000);
            }
        });
    }

    /* --- Contact Info & Session Handling --- */
    const contactInfoPhone = document.getElementById('contactPhoneDisplay');
    if (contactInfoPhone) {
        contactInfoPhone.textContent = '011 343 9956';
    }

    const contactInfoEmail = document.getElementById('contactEmailDisplay');
    if (contactInfoEmail) {
        const arenaEmail = 'info@nextlevelgamingarena.co.za';
        contactInfoEmail.textContent = arenaEmail;
        contactInfoEmail.href = `mailto:${arenaEmail}`;
    }

});
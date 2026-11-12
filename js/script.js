document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Active Navigation Link Switching
  const links = document.querySelectorAll('.nav-links a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      links.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  });

  // Offers Page Filter Pills
  const filterPills = document.querySelectorAll('.filter-pill');
  const offerCards = document.querySelectorAll('.offer-row-card');

  if (filterPills.length && offerCards.length) {
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((btn) => btn.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter');

        offerCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }


  // FAQ ACCORDION TOGGLE (Global - works on faq.html)
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector('.faq-question');

      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all items first (remove this if you want multiple open at once)
          faqItems.forEach((otherItem) => {
            otherItem.classList.remove('open');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          // Toggle the clicked item
          if (!isOpen) {
            item.classList.add('open');
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }


  // CONTACT PAGE FORM & CHARACTER COUNTER (Global - works on contact.html)
  const contactForm = document.getElementById('contactForm');
  const contactMessage = document.getElementById('contactMessage');
  const charCount = document.getElementById('charCount');

  if (contactMessage && charCount) {
    contactMessage.addEventListener('input', () => {
      const currentLength = contactMessage.value.length;
      charCount.textContent = `${currentLength}/250`;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const phoneInput = document.getElementById('contactPhone');
      const messageInput = document.getElementById('contactMessage');
      const globalError = document.getElementById('contactGlobalError');

      // Clear old error messages
      document.querySelectorAll('.contact-form .error-msg').forEach(el => el.textContent = '');
      document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(el => el.classList.remove('invalid'));
      if (globalError) globalError.textContent = '';

      let isValid = true;

      // Validate Name & Surname (at least 2 words)
      const nameVal = nameInput.value.trim();
      if (!nameVal || nameVal.split(/\s+/).length < 2) {
        nameInput.classList.add('invalid');
        document.getElementById('contactNameError').textContent = 'Please enter a valid name and surname.';
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        document.getElementById('contactEmailError').textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate 10-digit Phone
      const phoneRegex = /^\d{10}$/;
      if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
        phoneInput.classList.add('invalid');
        document.getElementById('contactPhoneError').textContent = 'Phone number must be exactly 10 digits.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('invalid');
        document.getElementById('contactMessageError').textContent = 'Please enter your message.';
        isValid = false;
      }

      if (!isValid) return;

      // Success feedback: Custom Cyan Modal with 2-second auto-close
      const contactModal = document.getElementById('contactSuccessModal');
      const contactModalText = document.getElementById('contactModalText');

      if (contactModal && contactModalText) {
        contactModalText.textContent = `Thank you ${nameVal}! The Next Level team will get back to you regarding your enquiry within 24 hours.`;
        contactModal.classList.remove('hidden');

        // Automatically close after 2 seconds (2000ms)
        setTimeout(() => {
          contactModal.classList.add('hidden');
        }, 2000);
      }

      contactForm.reset();
      if (charCount) charCount.textContent = '0/250';
    });
  }


  // BOOKING PAGE VALIDATION & REDIRECT TO FEES
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    // Restrict date input bounds: minimum = today, maximum = last day of current year
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      const maxStr = `${yyyy}-12-31`;

      bookingDateInput.min = todayStr;
      bookingDateInput.max = maxStr;
    }

    // Package & Experience +/- buttons
    const itemPills = document.querySelectorAll('.booking-item-pill');
    itemPills.forEach((pill) => {
      const minusBtn = pill.querySelector('.minus');
      const plusBtn = pill.querySelector('.plus');
      const valueEl = pill.querySelector('.qty-value');

      if (minusBtn && plusBtn && valueEl) {
        minusBtn.addEventListener('click', () => {
          const count = parseInt(valueEl.textContent, 10);
          if (count > 0) {
            valueEl.textContent = count - 1;
          }
        });

        plusBtn.addEventListener('click', () => {
          const count = parseInt(valueEl.textContent, 10);
          valueEl.textContent = count + 1;
        });
      }
    });

    // Guests +/- buttons
    const guestMinus = document.getElementById('guestMinus');
    const guestPlus = document.getElementById('guestPlus');
    const guestCountEl = document.getElementById('guestCount');

    if (guestMinus && guestPlus && guestCountEl) {
      guestMinus.addEventListener('click', () => {
        const guests = parseInt(guestCountEl.textContent, 10);
        if (guests > 1) {
          guestCountEl.textContent = guests - 1;
        }
      });

      guestPlus.addEventListener('click', () => {
        const guests = parseInt(guestCountEl.textContent, 10);
        guestCountEl.textContent = guests + 1;
      });
    }

    // Restore previous selections if returning via "EDIT BOOKING"
    const savedBookingRaw = sessionStorage.getItem('nextLevelBooking');
    if (savedBookingRaw) {
      try {
        const savedData = JSON.parse(savedBookingRaw);
        if (savedData.items) {
          itemPills.forEach((pill) => {
            const name = pill.getAttribute('data-name');
            const match = savedData.items.find((item) => item.name === name);
            if (match) {
              pill.querySelector('.qty-value').textContent = match.qty;
            }
          });
        }
        if (savedData.clientName) document.getElementById('clientName').value = savedData.clientName;
        if (savedData.clientEmail) document.getElementById('clientEmail').value = savedData.clientEmail;
        if (savedData.clientPhone) document.getElementById('clientPhone').value = savedData.clientPhone;
        if (savedData.bookingDate) document.getElementById('bookingDate').value = savedData.bookingDate;
        if (savedData.stationPass) document.getElementById('stationPass').value = savedData.stationPass;
        if (savedData.guests && guestCountEl) guestCountEl.textContent = savedData.guests;
      } catch (err) {
        console.error('Error restoring booking state:', err);
      }
    }

    // Calculate Fees Submission -> Validate & Redirect to fees.html
    const globalErrorMsg = document.getElementById('formGlobalError');

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous error states
      if (globalErrorMsg) globalErrorMsg.textContent = '';
      document.querySelectorAll('.error-msg').forEach((el) => (el.textContent = ''));
      document.querySelectorAll('input, select').forEach((el) => el.classList.remove('invalid'));

      let isValid = true;

      // 1. Validate Name & Surname (at least two words)
      const nameInput = document.getElementById('clientName');
      const nameVal = nameInput.value.trim();
      const nameParts = nameVal.split(/\s+/);
      if (!nameVal || nameParts.length < 2) {
        nameInput.classList.add('invalid');
        document.getElementById('nameError').textContent = 'Please enter both a valid name and surname.';
        isValid = false;
      }

      // 2. Validate Email Address
      const emailInput = document.getElementById('clientEmail');
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        emailInput.classList.add('invalid');
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // 3. Validate 10-digit Phone Number
      const phoneInput = document.getElementById('clientPhone');
      const phoneVal = phoneInput.value.trim();
      const phoneRegex = /^\d{10}$/;
      if (!phoneVal || !phoneRegex.test(phoneVal)) {
        phoneInput.classList.add('invalid');
        document.getElementById('phoneError').textContent = 'Phone number must be exactly 10 digits.';
        isValid = false;
      }

      // 4. Validate Date (cannot be past, cannot be next year)
      const dateInput = document.getElementById('bookingDate');
      const dateVal = dateInput.value;
      if (!dateVal) {
        dateInput.classList.add('invalid');
        document.getElementById('dateError').textContent = 'Please select a booking date.';
        isValid = false;
      } else {
        const selectedDate = new Date(dateVal);
        const currentYear = new Date().getFullYear();
        const minDateStr = dateInput.min;
        const maxDateStr = dateInput.max;

        if (dateVal < minDateStr || dateVal > maxDateStr || selectedDate.getFullYear() !== currentYear) {
          dateInput.classList.add('invalid');
          document.getElementById('dateError').textContent = `Date must be within the current year (${currentYear}) and cannot be in the past.`;
          isValid = false;
        }
      }

      // 5. Validate Station Pass Selection
      const stationSelect = document.getElementById('stationPass');
      if (!stationSelect.value) {
        stationSelect.classList.add('invalid');
        document.getElementById('stationError').textContent = 'Please select a station pass option.';
        isValid = false;
      }

      // 6. Collect selected Packages & Experiences
      const selectedItems = [];
      let totalSelectedItems = 0;

      itemPills.forEach((pill) => {
        const name = pill.getAttribute('data-name');
        const price = parseInt(pill.getAttribute('data-price'), 10);
        const qty = parseInt(pill.querySelector('.qty-value').textContent, 10);

        if (qty > 0) {
          selectedItems.push({ name, price, qty });
          totalSelectedItems += qty;
        }
      });

      if (totalSelectedItems === 0) {
        if (globalErrorMsg) globalErrorMsg.textContent = 'Please select at least one package or experience.';
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      const selectedOption = stationSelect.options[stationSelect.selectedIndex];
      const stationFee = selectedOption ? parseInt(selectedOption.getAttribute('data-fee') || '0', 10) : 0;

      const bookingPayload = {
        items: selectedItems,
        totalItemsCount: totalSelectedItems,
        clientName: nameVal,
        clientEmail: emailVal,
        clientPhone: phoneVal,
        bookingDate: dateVal,
        stationPass: stationSelect.value,
        stationFee,
        guests: parseInt(guestCountEl.textContent, 10)
      };

      sessionStorage.setItem('nextLevelBooking', JSON.stringify(bookingPayload));
      window.location.href = 'fees.html';
    });
  }


  // FEES PAGE RENDERING & DISCOUNT CALCULATION
  const feesContent = document.getElementById('feesContent');
  const noBookingFallback = document.getElementById('noBookingFallback');

  if (feesContent && noBookingFallback) {
    const storedDataRaw = sessionStorage.getItem('nextLevelBooking');

    if (!storedDataRaw) {
      feesContent.classList.add('hidden');
      noBookingFallback.classList.remove('hidden');
      return;
    }

    const bookingData = JSON.parse(storedDataRaw);

    // Format Date as DD MMM YYYY (e.g., 14 Nov 2026)
    let formattedDate = bookingData.bookingDate;
    if (bookingData.bookingDate) {
      const [year, month, day] = bookingData.bookingDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    // Populate Client & Session Summary if container exists
    const clientSummaryDetails = document.getElementById('clientSummaryDetails');
    if (clientSummaryDetails) {
      clientSummaryDetails.innerHTML = `
        <div class="client-detail-item"><span class="client-detail-label">Client Name</span><span class="client-detail-value">${bookingData.clientName}</span></div>
        <div class="client-detail-item"><span class="client-detail-label">Email</span><span class="client-detail-value">${bookingData.clientEmail}</span></div>
        <div class="client-detail-item"><span class="client-detail-label">Phone</span><span class="client-detail-value">${bookingData.clientPhone}</span></div>
        <div class="client-detail-item"><span class="client-detail-label">Date</span><span class="client-detail-value">${formattedDate}</span></div>
        <div class="client-detail-item"><span class="client-detail-label">Station Pass</span><span class="client-detail-value">${bookingData.stationPass}</span></div>
        <div class="client-detail-item"><span class="client-detail-label">Guests</span><span class="client-detail-value">${bookingData.guests}</span></div>
      `;
    }

    // Populate Itemized Breakdown & Calculate Subtotal
    const feesItemsList = document.getElementById('feesItemsList');
    if (feesItemsList) {
      feesItemsList.innerHTML = '';
      let subtotal = 0;
      let totalCount = 0;

      bookingData.items.forEach((item) => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;
        totalCount += item.qty;

        const row = document.createElement('div');
        row.className = 'summary-line';
        row.innerHTML = `<span>${item.name} (x${item.qty})</span><span>R ${lineTotal.toLocaleString()}</span>`;
        feesItemsList.appendChild(row);
      });

      if (bookingData.stationFee > 0) {
        subtotal += bookingData.stationFee;
        const stationRow = document.createElement('div');
        stationRow.className = 'summary-line';
        stationRow.innerHTML = `<span>Station Pass (${bookingData.stationPass})</span><span>R ${bookingData.stationFee.toLocaleString()}</span>`;
        feesItemsList.appendChild(stationRow);
      }

      // Apply Discount Tiers: 2 items = 5%, 3 items = 10%, > 3 items = 15%
      let discountRate = 0;
      if (totalCount === 2) {
        discountRate = 0.05;
      } else if (totalCount === 3) {
        discountRate = 0.10;
      } else if (totalCount > 3) {
        discountRate = 0.15;
      }

      const discountAmount = Math.round(subtotal * discountRate);
      const discountedTotal = subtotal - discountAmount;
      const vatAmount = Math.round(discountedTotal * 0.15);
      const grandTotal = discountedTotal + vatAmount;

      // Update DOM elements safely
      const totalQtyLabel = document.getElementById('totalQtyLabel');
      if (totalQtyLabel) totalQtyLabel.textContent = totalCount;

      const feesSubtotal = document.getElementById('feesSubtotal');
      if (feesSubtotal) feesSubtotal.textContent = `R ${subtotal.toLocaleString()}`;

      const discountLabel = document.getElementById('discountLabel');
      if (discountLabel) discountLabel.textContent = `Discount (${Math.round(discountRate * 100)}%)`;

      const feesDiscount = document.getElementById('feesDiscount');
      if (feesDiscount) feesDiscount.textContent = discountAmount > 0 ? `-R ${discountAmount.toLocaleString()}` : '-R 0';

      const feesDiscountedTotal = document.getElementById('feesDiscountedTotal');
      if (feesDiscountedTotal) feesDiscountedTotal.textContent = `R ${discountedTotal.toLocaleString()}`;

      const feesAfterDiscount = document.getElementById('feesAfterDiscount');
      if (feesAfterDiscount) feesAfterDiscount.textContent = `R ${discountedTotal.toLocaleString()}`;

      const feesVat = document.getElementById('feesVat');
      if (feesVat) feesVat.textContent = `R ${vatAmount.toLocaleString()}`;

      const feesGrandTotal = document.getElementById('feesGrandTotal');
      if (feesGrandTotal) feesGrandTotal.textContent = `R ${grandTotal.toLocaleString()}`;
    }

    // Lock In Session Button -> Redirect to confirmation.html
    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    if (confirmBookingBtn) {
      confirmBookingBtn.addEventListener('click', () => {
        window.location.href = 'confirmation.html';
      });
    }
  }


  // CONFIRMATION PAGE DATA POPULATION
  const confName = document.getElementById('confName');
  if (confName) {
    const storedDataRaw = sessionStorage.getItem('nextLevelBooking');
    if (storedDataRaw) {
      const bookingData = JSON.parse(storedDataRaw);

      // Format Date as DD-MM-YYYY
      let formattedDate = bookingData.bookingDate;
      if (bookingData.bookingDate) {
        const [year, month, day] = bookingData.bookingDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        formattedDate = dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-');
      }

      // Populate confirmation fields
      document.getElementById('confBookingId').textContent = 'NXL-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('confName').textContent = bookingData.clientName || '-';
      document.getElementById('confEmail').textContent = bookingData.clientEmail || '-';
      document.getElementById('confPhone').textContent = bookingData.clientPhone || '-';
      document.getElementById('confDate').textContent = formattedDate || '-';
      document.getElementById('confStation').textContent = (bookingData.stationPass || '-').toUpperCase();
      document.getElementById('confGuests').textContent = bookingData.guests || '1';

      // Calculate Grand Total
      let subtotal = 0;
      let totalCount = 0;
      if (bookingData.items) {
        bookingData.items.forEach((item) => {
          subtotal += item.price * item.qty;
          totalCount += item.qty;
        });
      }
      if (bookingData.stationFee) {
        subtotal += bookingData.stationFee;
      }

      let discountRate = 0;
      if (totalCount === 2) discountRate = 0.05;
      else if (totalCount === 3) discountRate = 0.10;
      else if (totalCount > 3) discountRate = 0.15;

      const discountAmount = Math.round(subtotal * discountRate);
      const discountedTotal = subtotal - discountAmount;
      const vatAmount = Math.round(discountedTotal * 0.15);
      const grandTotal = discountedTotal + vatAmount;

      document.getElementById('confGrandTotal').textContent = `R ${grandTotal.toLocaleString()}`;
    }

    // Clear booking session data when dismissing confirmation
    const dismissBtn = document.getElementById('dismissBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        sessionStorage.removeItem('nextLevelBooking');
      });
    }
  }
});
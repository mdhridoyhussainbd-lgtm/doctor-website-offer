(function () {
  const BKASH_NUMBER = '01751210179';
  const WHATSAPP_DISPLAY = '01302778420';
  const WHATSAPP_NUMBER = '8801302778420';

  const body = document.body;
  const orderModal = document.getElementById('orderModal');
  const orderForm = document.getElementById('orderForm');
  const selectedPackage = document.getElementById('selectedPackage');
  const selectedAmount = document.getElementById('selectedAmount');
  const copyBkash = document.getElementById('copyBkash');
  const toast = document.getElementById('toast');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const slides = [...document.querySelectorAll('[data-slide]')];
  const dots = [...document.querySelectorAll('[data-dot]')];
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const slider = document.querySelector('[data-slider]');
  let currentSlide = 0;
  let slideTimer = null;
  let currentStep = 1;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function formatAmount(amount) {
    return '৳' + Number(amount).toLocaleString('en-US');
  }

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  function startSlider() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), 4500);
  }

  prev?.addEventListener('click', () => { showSlide(currentSlide - 1); startSlider(); });
  next?.addEventListener('click', () => { showSlide(currentSlide + 1); startSlider(); });
  dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.dot)); startSlider(); }));
  slider?.addEventListener('mouseenter', () => clearInterval(slideTimer));
  slider?.addEventListener('mouseleave', startSlider);
  startSlider();

  function openModal(pkg, amount) {
    selectedPackage.textContent = pkg || 'Professional';
    selectedAmount.textContent = formatAmount(amount || 6999);
    orderModal.classList.add('active');
    orderModal.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
    setStep(1, false);
    setTimeout(() => document.getElementById('bkashSender')?.focus(), 200);
  }

  function closeModal() {
    orderModal.classList.remove('active');
    orderModal.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
  }

  document.querySelectorAll('.choose-package, .open-order-demo').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('[data-package]');
      const pkg = button.dataset.package || card?.dataset.package || 'Professional';
      const amount = button.dataset.amount || card?.dataset.amount || 6999;
      openModal(pkg, amount);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && orderModal.classList.contains('active')) closeModal(); });

  copyBkash?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      showToast('bKash number copied: ' + BKASH_NUMBER);
    } catch (_) {
      const input = document.createElement('input');
      input.value = BKASH_NUMBER;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      showToast('bKash number copied: ' + BKASH_NUMBER);
    }
  });

  function clearFieldErrors(step) {
    step.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
  }

  function validateStep(stepNumber) {
    const step = document.querySelector(`[data-form-step="${stepNumber}"]`);
    if (!step) return true;
    clearFieldErrors(step);
    const required = [...step.querySelectorAll('[required]')];
    let firstInvalid = null;
    required.forEach(field => {
      const valid = field.type === 'email' ? field.checkValidity() : field.value.trim().length > 0;
      if (!valid) {
        field.classList.add('field-error');
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      showToast('Please complete the required fields first.');
      return false;
    }
    return true;
  }

  function setStep(stepNumber, scroll = true) {
    currentStep = stepNumber;
    document.querySelectorAll('[data-form-step]').forEach(step => step.classList.toggle('active', Number(step.dataset.formStep) === stepNumber));
    document.querySelectorAll('[data-step-jump]').forEach(btn => btn.classList.toggle('active', Number(btn.dataset.stepJump) === stepNumber));
    if (scroll) orderModal.querySelector('.order-panel').scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.next-step').forEach(button => button.addEventListener('click', () => {
    if (validateStep(currentStep)) setStep(Number(button.dataset.nextStep));
  }));
  document.querySelectorAll('.prev-step').forEach(button => button.addEventListener('click', () => setStep(Number(button.dataset.prevStep))));
  document.querySelectorAll('[data-step-jump]').forEach(button => button.addEventListener('click', () => {
    const target = Number(button.dataset.stepJump);
    if (target < currentStep || validateStep(currentStep)) setStep(target);
  }));


  function value(id) {
    return document.getElementById(id)?.value.trim() || '';
  }

  function linesForChamber(number) {
    const name = value(`chamber${number}Name`);
    const address = value(`chamber${number}Address`);
    const hours = value(`chamber${number}Hours`);
    const appointment = value(`chamber${number}Appointment`);
    const fee = value(`chamber${number}Fee`);
    if (!name && !address && !hours && !appointment && !fee) return [];
    return [
      '',
      `*Chamber 0${number}*`,
      `Name: ${name || '-'}`,
      `Address: ${address || '-'}`,
      `Visiting Hour & Off Days: ${hours || '-'}`,
      `Appointment Number: ${appointment || '-'}`,
      `Consultation Fee: ${fee || '-'}`
    ];
  }

  function buildOrderMessage() {
    return [
      'Hello Web Work Media, I have completed the Doctor Website order form.',
      '',
      '*ORDER DETAILS*',
      `Package: ${selectedPackage.textContent.trim()}`,
      `Amount: ${selectedAmount.textContent.trim()}`,
      `bKash Send Money Number: ${BKASH_NUMBER}`,
      `bKash Sender Number: ${value('bkashSender')}`,
      `Transaction ID: ${value('transactionId')}`,
      '',
      '*DOCTOR PROFILE*',
      `Doctor's Name: ${value('doctorName')}`,
      `Doctor's Email: ${value('doctorEmail')}`,
      `Doctor's Personal Mobile Number: ${value('doctorMobile')}`,
      `BM&DC Number: ${value('bmdc')}`,
      `Degrees: ${value('degrees')}`,
      `Fellowships or Trainings: ${value('training') || '-'}`,
      `Specialty: ${value('specialty')}`,
      `Experience: ${value('experience') || '-'}`,
      `Workplace: ${value('workplace') || '-'}`,
      `Designation & Department: ${value('designation') || '-'}`,
      `Memberships: ${value('memberships') || '-'}`,
      ...linesForChamber(1),
      ...linesForChamber(2),
      ...linesForChamber(3),
      '',
      `WhatsApp contact: ${WHATSAPP_DISPLAY}`
    ].join('\n');
  }


  orderForm?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const message = buildOrderMessage();
    try { await navigator.clipboard.writeText(message); } catch (_) {}
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    showToast('WhatsApp opened with the completed order details.');
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1 });
    revealNodes.forEach(node => observer.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add('visible'));
  }
})();

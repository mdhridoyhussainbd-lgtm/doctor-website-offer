
(function () {
  const body = document.body;
  const modal = document.getElementById('paymentModal');
  const selectedPackage = document.getElementById('selectedPackage');
  const selectedAmount = document.getElementById('selectedAmount');
  const bkashNumberEl = document.getElementById('bkashNumber');
  const copyBtn = document.getElementById('copyBkash');
  const paymentForm = document.getElementById('paymentForm');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const chooseButtons = document.querySelectorAll('.choose-package');
  const closeTriggers = document.querySelectorAll('[data-close-modal]');
  const WHATSAPP_NUMBER = '8801302778420';

  function formatAmount(amount) {
    return '৳' + Number(amount).toLocaleString('en-US');
  }

  function openModal(pkg, amount) {
    selectedPackage.textContent = pkg;
    selectedAmount.textContent = formatAmount(amount);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
  }

  chooseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.price-card');
      openModal(card?.dataset.package || 'Professional', card?.dataset.amount || '6999');
    });
  });

  closeTriggers.forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  if (copyBtn && bkashNumberEl) {
    copyBtn.addEventListener('click', async () => {
      const number = bkashNumberEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(number);
        copyBtn.textContent = 'Copied';
        setTimeout(() => (copyBtn.textContent = 'Copy Number'), 1600);
      } catch (_) {
        const temp = document.createElement('input');
        temp.value = number;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        copyBtn.textContent = 'Copied';
        setTimeout(() => (copyBtn.textContent = 'Copy Number'), 1600);
      }
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('customerName').value.trim();
      const phone = document.getElementById('customerPhone').value.trim();
      const transactionId = document.getElementById('transactionId').value.trim();
      const note = document.getElementById('orderNote').value.trim();
      const pkg = selectedPackage.textContent.trim();
      const amount = selectedAmount.textContent.trim();
      const bkash = bkashNumberEl.textContent.trim();

      const message = [
        'Hi Web Work Media, I want to order a doctor website.',
        '',
        '*Order Details*',
        'Package: ' + pkg,
        'Amount: ' + amount,
        'Customer Name: ' + name,
        'Phone Number: ' + phone,
        'bKash Number Paid To: ' + bkash,
        'bKash Transaction ID: ' + transactionId,
        note ? 'Doctor Name / Note: ' + note : null,
      ].filter(Boolean).join('\n');

      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
      closeModal();
      paymentForm.reset();
    });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('visible'));
  }
})();

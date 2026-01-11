import './style.css';

function init() {
  let baseCurrency = null;
  let targetCurrency = null;

  const baseCurrencyCards = document.querySelectorAll('.base-cards .card');
  const targetCurrencyCards = document.querySelectorAll('.target-cards .card');
  const trackLink = document.querySelector('.track-link');

  function syncTargetCards() {
    // No base selected → lock target step + reset target selection
    if (!baseCurrency) {
      targetCurrencyCards.forEach((card) => {
        card.disabled = true;
        card.classList.remove('active');
        card.setAttribute('aria-checked', 'false');
      });

      targetCurrency = null;
      return;
    }
    if (targetCurrency === baseCurrency) {
      targetCurrency = null;
      document.querySelector('.target-cards .card.active')?.classList.remove('active');
    }
    targetCurrencyCards.forEach((card) => {
      const isSameAsBase = card.dataset.currency === baseCurrency;
      card.disabled = isSameAsBase;
    });
  }

  // Set default target cards
  syncTargetCards();

  // Keep button/link disabled initially
  trackLink.setAttribute('aria-disabled', true);

  function updateTrackLink() {
    if (baseCurrency && targetCurrency) {
      trackLink.removeAttribute('aria-disabled');
      trackLink.setAttribute('href', `results.html?base=${baseCurrency}&target=${targetCurrency}`);
    } else {
      trackLink.setAttribute('aria-disabled', true);
    }
  }

  baseCurrencyCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      // remove previous active card
      baseCurrency = card.dataset.currency;
      document.querySelector('.base-cards .card.active')?.classList.remove('active');
      event.currentTarget.classList.add('active');
      syncTargetCards();
      updateTrackLink();
    });
  });

  targetCurrencyCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      // remove previous active card
      targetCurrency = card.dataset.currency;
      document.querySelector('.target-cards .card.active')?.classList.remove('active');
      event.currentTarget.classList.add('active');
      updateTrackLink();
    });
  });
}

init();

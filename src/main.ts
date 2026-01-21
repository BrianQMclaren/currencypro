import './style.css';

type Currency = string | null;

function init() {
  let baseCurrency: Currency = null;
  let targetCurrency: Currency = null;

  const baseCurrencyCards = document.querySelectorAll<HTMLButtonElement>('.base-cards .card');
  const targetCurrencyCards = document.querySelectorAll<HTMLButtonElement>('.target-cards .card');
  const trackLink = document.querySelector<HTMLAnchorElement>('.track-link');

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
  trackLink?.setAttribute('aria-disabled', 'true');

  function updateTrackLink() {
    if (baseCurrency && targetCurrency) {
      trackLink?.removeAttribute('aria-disabled');
      trackLink?.setAttribute('href', `results.html?base=${baseCurrency}&target=${targetCurrency}`);
    } else {
      trackLink?.setAttribute('aria-disabled', 'true');
    }
  }

  baseCurrencyCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      // remove previous active card
      const currency = card.dataset.currency;
      if (!currency) {
        throw new Error('Card is missing data-currency attribute');
      }
      baseCurrency = currency;
      document.querySelector('.base-cards .card.active')?.classList.remove('active');
      card.classList.add('active');
      syncTargetCards();
      updateTrackLink();
    });
  });

  targetCurrencyCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      // remove previous active card
      const currency = card.dataset.currency;
      if (!currency) {
        throw new Error('Card is missing data-currency attribute');
      }
      targetCurrency = currency;
      document.querySelector('.target-cards .card.active')?.classList.remove('active');
      card.classList.add('active');
      updateTrackLink();
    });
  });
}

init();

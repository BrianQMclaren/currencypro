import FetchWrapper from './fetch-wrapper';

const exchangeApi = import.meta.env.VITE_EXCHANGE_API;

async function fetchConversionRate(baseCurrency) {
  try {
    const API = new FetchWrapper(`https://v6.exchangerate-api.com/v6/${exchangeApi}`);
    const data = await API.get(`/latest/${baseCurrency}`);
    return data;
  } catch (error) {
    console.error('request from api failed');
  }
}

function init() {
  const url = new URL(window.location.href);
  const baseCurrency = url.searchParams.get('base');
  const targetCurrency = url.searchParams.get('target');
  const bCurrency = document.querySelector('#base-currency');
  const conversionRate = document.querySelector('#conversion-rate');
  const tCurrency = document.querySelector('#target-currency');
  const lastUpdated = document.querySelector('#last-updated');

  if (!baseCurrency || !targetCurrency) {
    return;
  }

  fetchConversionRate(baseCurrency)
    .then((data) => {
      const rate = data.conversion_rates[targetCurrency];
      const formatted = rate.toFixed(2);
      conversionRate.textContent = formatted;
      bCurrency.textContent = baseCurrency;
      tCurrency.textContent = targetCurrency;
      const unixSeconds = data.time_last_update_unix;
      const date = new Date(unixSeconds * 1000);
      lastUpdated.textContent = date.toLocaleString();
    })
    .catch(() => console.error('data did not return successfully'));
}

init();

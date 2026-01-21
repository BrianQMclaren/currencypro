import FetchWrapper from './fetch-wrapper';

const exchangeApi = import.meta.env.VITE_EXCHANGE_API;

interface ExchangeRateResponse {
  conversion_rates: Record<string, number>;
  time_last_update_unix: number;
}

async function fetchConversionRate(baseCurrency: string) {
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
  const bCurrency = document.querySelector<HTMLElement>('#base-currency');
  const conversionRate = document.querySelector<HTMLElement>('#conversion-rate');
  const tCurrency = document.querySelector<HTMLElement>('#target-currency');
  const lastUpdated = document.querySelector<HTMLElement>('#last-updated');

  if (!baseCurrency || !targetCurrency) {
    return;
  }

  if (!conversionRate || !bCurrency || !tCurrency || !lastUpdated) {
    throw new Error('Missing required DOM elements');
  }

  fetchConversionRate(baseCurrency)
    .then((data) => {
      const response = data as ExchangeRateResponse;
      const rate = response.conversion_rates[targetCurrency];
      if (rate == null) {
        console.error('Rate missing for:', targetCurrency);
        return;
      }
      const formatted = rate.toFixed(2);
      conversionRate.textContent = formatted;
      bCurrency.textContent = baseCurrency;
      tCurrency.textContent = targetCurrency;
      const unixSeconds = response.time_last_update_unix;
      const date = new Date(unixSeconds * 1000);
      lastUpdated.textContent = date.toLocaleString();
    })
    .catch(() => console.error('data did not return successfully'));
}

init();

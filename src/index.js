import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputName = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputName.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  e.preventDefault();

  const input = e.target;
  const value = input.value.trim();
  // console.log(value.length);
  clearMarkup();

  if (value !== '') {
    fetchCountries(value)
      .then(data => {
        if (data.length > 10) {
          return Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          return renderMarkupCountry(data);
        } else if (data.length === 1) {
          return renderMarkupOneCountry(data);
        }
      })
      .catch(onError);
    // .finally(() => inputName.reset());
  }
}

function renderMarkupCountry(countries) {
  const markup = countries
    .map(
      country =>
        `<li class="country__card">
    <img class="country__img" src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" height="20"> <b>${country.name.official}</b></img>
    </li>`
    )
    .join('');
  countryList.innerHTML = markup;
}

function renderMarkupOneCountry(countries) {
  const markup = countries
    .map(
      country =>
        `<div class="country">
    <img class="country__img" src="${country.flags.svg}" alt="Flag of ${
          country.name.official
        }" width="40" height="30"> <span class="country__name">${
          country.name.official
        }</span></img>
    <h2 class="country__capital">Capital: <span class="result">${
      country.capital
    }</span></h2>
    <h3 class="country__population">Population: <span class="result">${
      country.population
    }</span></h3>
    <p class="country__languages"><b>Languages: <span class="result">${Object.values(
      country.languages
    ).join(', ')}</span></b></p>
    </div>`
    )
    .join('');
  countryInfo.innerHTML = markup;
}

function onError(err) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

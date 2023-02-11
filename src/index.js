import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputName = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
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
      .then(updateList)
      .catch(onError);
    // .finally(() => inputName.reset());
  }
}

function renderMarkupCountry(countries) {
  return countries
    .map(
      country =>
        `<div class="country">
    <img class="country__img" src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" height="20"> <b>${country.name.official}</b></img>
    </div>`
    )
    .join('');
}

function renderMarkupOneCountry(countries) {
  return countries
    .map(
      country =>
        `<div class="country">
    <img class="country__img" src="${country.flags.svg}" alt="Flag of ${
          country.name.official
        }" width="40" height="30"> <span class="country__name">${
          country.name.official
        }</span></img>
    <h2 class="country__capital">Capital: ${country.capital}</h2>
    <h3 class="country__population">Population: ${country.population}</h3>
    <p class="country__languages"><b>Languages: ${Object.values(
      country.languages
    )}</b></p>
    </div>`
    )
    .join('');
}
function updateList(markup) {
  countryList.innerHTML = markup;
}

function onError(err) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearMarkup() {
  countryList.innerHTML = '';
}

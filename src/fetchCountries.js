const searchParams = new URLSearchParams({
  fields: ['name', 'capital', 'population', 'flags', 'languages'],
});

function fetchCountries(name) {
  const URL = `https://restcountries.com/v3.1/name/${name}?${searchParams}`;

  return fetch(URL).then(response => {
    if (response.status == 404) {
      console.log(`failed ${response.statusText} : ${response.status}`);
    } else if (response.status >= 200 && response.status < 300) {
      console.log(`success ${response.statusText} : ${response.status}`);
      return response.json();
    } else {
      throw new Error(response.status);
    }
  });
}

export { fetchCountries };

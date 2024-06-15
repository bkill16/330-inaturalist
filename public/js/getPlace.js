async function getInfo(event) {
    event.preventDefault();
    const place = document.getElementById("place-search").value;
    const placeId = await getPlaceId(place);
    const identifications = await getIdentifications(placeId);
    await displayResults(identifications);
  }
  
  async function getPlaceId(place) {
    const response = await fetch(
      `https://api.inaturalist.org/v1/places/autocomplete?q=${place}`
    );
    const data = await response.json();
    console.log(data);
    const placeId = data.results[0].id;
    console.log(placeId);
    return placeId;
  }
  
  async function getIdentifications(placeId) {
    const response = await fetch(
      `https://api.inaturalist.org/v1/identifications?current=true&place_id=${placeId}&order=desc&order_by=created_at`
    );
    const data = await response.json();
    const identifications = data.results;
    console.log(identifications);
    return identifications;
  }
  
  async function displayResults(identifications) {
    const display = document.querySelector("#display-results");
    display.innerHTML = "";
  
    if (identifications.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No identifications found.";
      display.appendChild(p);
    } else {
      for (let i = 0; i < identifications.length; i++) {
        const identification = identifications[i];
        const name = await getTaxonName(identification.taxon_id);
        const image = await getTaxonImage(identification.taxon_id);
        const p = document.createElement("p");
        p.innerHTML = `<img src="${image}" /> ${name}`;
        display.appendChild(p);
      }
    }
  }
  
  async function getTaxonName(taxonId) {
    const response = await fetch(`https://api.inaturalist.org/v1/taxa/${taxonId}`);
    const data = await response.json();
    return data.results[0].name;
  }

  async function getTaxonImage(taxonId) {
    const response = await fetch(`https://api.inaturalist.org/v1/taxa/${taxonId}`);
    const data = await response.json();
    return data.results[0].default_photo.url;
  }
  
  document.querySelector("form").addEventListener("submit", getInfo);
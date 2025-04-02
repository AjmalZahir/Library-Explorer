//Library Map
// Initializes a Leaflet map, fetches libraries, and displays them with geolocation support.
// Contributor: M Z M Ajmal / m67-mohamedzah
import { fetchLibraries } from "./api.js";

const map = L.map("map").setView([51.464207314002266, -2.5825793625934468], 13); // Default to Bristol

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/// Function to fetch libraries from the API
function showLibrariesOnMap(libraries, highlightedLibraryName, map) {
  libraries.forEach((library) => {
    const coords = library.geometry.coordinates;
    const name = library.properties.NAME;
    const address =
      library.properties.FULL_ADDRESS ||
      `${library.properties.STREET}, ${library.properties.TOWN}, ${library.properties.POSTCODE}`;

    const marker = L.marker([coords[1], coords[0]])
      .addTo(map)
      .bindPopup(
        `<b>${name}</b><br>
         ${address}<br>
         <a href="libraryList.html?library=${encodeURIComponent(
           name
         )}">View in table</a>`
      );

    if (highlightedLibraryName === name) {
      marker.openPopup();
      map.setView([coords[1], coords[0]], 15);
    }
  });
}

/// Center the map on the given coordinates
function centerMapOnLocation(lat, lng, map) {
  map.setView([lat, lng], 14);
}

/// Handle geolocation success
function handleGeolocationSuccess(position, map) {
  const { latitude, longitude } = position.coords;
  centerMapOnLocation(latitude, longitude, map);

  fetchLibraries().then((libraries) => {
    showLibrariesOnMap(
      libraries,
      decodeURIComponent(urlParams.get("library")),
      map
    );
  });
}

/// Handle geolocation errors
function handleGeolocationError(error, map) {
  console.error("Geolocation error:", error);
  const bristolLat = 51.4545;
  const bristolLng = -2.5879;
  centerMapOnLocation(bristolLat, bristolLng, map);

  fetchLibraries().then((libraries) => {
    showLibrariesOnMap(
      libraries,
      decodeURIComponent(urlParams.get("library")),
      map
    );
  });

  alert("Unable to determine your location. Showing libraries in Bristol.");
}

const urlParams = new URLSearchParams(window.location.search);
const highlightedLibraryName = decodeURIComponent(
  urlParams.get("library") || ""
);

fetchLibraries().then((libraries) => {
  if (highlightedLibraryName) {
    const library = libraries.find(
      (lib) => lib.properties.NAME === highlightedLibraryName
    );
    if (library) {
      const coords = library.geometry.coordinates;
      map.setView([coords[1], coords[0]], 15);
    }
  }
  showLibrariesOnMap(libraries, highlightedLibraryName, map);
});

if (!highlightedLibraryName) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => handleGeolocationSuccess(position, map),
      (error) => handleGeolocationError(error, map)
    );
  } else {
    handleGeolocationError({ message: "Geolocation not supported" }, map);
  }
}

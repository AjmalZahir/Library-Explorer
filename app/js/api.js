// This file contains the API call to fetch data from the Bristol City Council API
// and returns a promise that resolves with the library data in GeoJSON format.
const apiUrl =
  "https://maps2.bristol.gov.uk/server2/rest/services/ext/ll_leisure_and_culture/MapServer/0/query?outFields=*&where=1%3D1&f=geojson";

export function fetchLibraries() {
  return new Promise((resolve, reject) => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => resolve(data.features))
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
}

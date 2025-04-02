// libraryList.js
/* This file handles the list view of the libraries */
// Contributor: Rishon

import { fetchLibraries } from "./api.js";

const urlParams = new URLSearchParams(window.location.search);
const highlightedLibraryName = decodeURIComponent(
  urlParams.get("library") || ""
);

let libraries = [];
let filteredLibraries = [];
let userLocation = null;

//Sort directions
const sortDirections = {
  name: 1,
  town: 1,
  distance: 1,
};

function highlightAndScrollToLibrary() {
  if (!highlightedLibraryName) return;

  setTimeout(() => {
    const rows = document.querySelectorAll("#libraryTable tbody tr");
    for (const row of rows) {
      const nameCell = row.querySelector("td:first-child");
      if (nameCell && nameCell.textContent.trim() === highlightedLibraryName) {
        row.classList.add("highlighted");
        row.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          row.classList.add("fade-out");
          setTimeout(() => {
            row.classList.remove("highlighted", "fade-out");
          }, 500);
        }, 3000);
        break;
      }
    }
  }, 100);
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Sort libraries
function sortLibraries(librariesToSort, sortBy, direction) {
  return [...librariesToSort].sort((a, b) => {
    const propsA = a.properties;
    const propsB = b.properties;

    if (sortBy === "name") {
      return direction * propsA.NAME.localeCompare(propsB.NAME);
    } else if (sortBy === "town") {
      return direction * propsA.TOWN.localeCompare(propsB.TOWN);
    } else if (sortBy === "distance" && userLocation) {
      const distA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.geometry.coordinates[1],
        a.geometry.coordinates[0]
      );
      const distB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.geometry.coordinates[1],
        b.geometry.coordinates[0]
      );
      return direction * (distA - distB);
    }
    return 0;
  });
}

function renderLibraries(librariesToRender) {
  const tableBody = document.querySelector("#libraryTable tbody");
  tableBody.innerHTML = "";

  if (librariesToRender.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='9'>No libraries found.</td></tr>";
    return;
  }

  librariesToRender.forEach((library) => {
    const row = document.createElement("tr");
    const name = library.properties.NAME;
    const fullUrl = library.properties.URL;
    const shortUrl =
      fullUrl.length > 30 ? fullUrl.substring(0, 30) + "..." : fullUrl;
    const coords = library.geometry.coordinates;

    // Calculate distance if user location is available
    let distance = "";
    if (userLocation) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        coords[1],
        coords[0]
      );
      distance = dist.toFixed(2) + " km";
    }

    row.innerHTML = `
      <td>${name}</td>
      <td>${library.properties.STREET}</td>
      <td>${library.properties.TOWN}</td>
      <td>${library.properties.POSTCODE}</td>
      <td><a href="tel:${library.properties.TELEPHONE}">${
      library.properties.TELEPHONE
    }</a></td>
      <td><a href="mailto:${library.properties.EMAIL_ADDR}">${
      library.properties.EMAIL_ADDR
    }</a></td>
      <td><a href="${fullUrl}" target="_blank">${shortUrl}</a></td>
      <td>${distance}</td>
      <td><a href="libraryMap.html?library=${encodeURIComponent(
        name
      )}" class="view-on-map">View on map</a></td>
    `;
    tableBody.appendChild(row);
  });

  highlightAndScrollToLibrary();
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterLibraries(searchTerm, document.getElementById("townFilter").value);
  });
}

function setupTownFilter() {
  const townFilter = document.getElementById("townFilter");

  const towns = [
    ...new Set(libraries.map((library) => library.properties.TOWN)),
  ].sort();

  towns.forEach((town) => {
    const option = document.createElement("option");
    option.value = town;
    option.textContent = town;
    townFilter.appendChild(option);
  });

  townFilter.addEventListener("change", (e) => {
    const selectedTown = e.target.value;
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    filterLibraries(searchTerm, selectedTown);
  });
}

// Setup sorting buttons
function setupSorting() {
  document.querySelectorAll(".sort-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const sortBy = this.dataset.sort;
      sortDirections[sortBy] *= -1;

      // Update UI
      document.querySelectorAll(".sort-btn i").forEach((icon) => {
        icon.className = "fas fa-sort";
      });
      const icon = this.querySelector("i");
      icon.className =
        sortDirections[sortBy] === 1 ? "fas fa-sort-up" : "fas fa-sort-down";

      // Sort and render
      filteredLibraries = sortLibraries(
        filteredLibraries,
        sortBy,
        sortDirections[sortBy]
      );
      renderLibraries(filteredLibraries);
    });
  });
}

// Contributor: M Z M Ajmal / m67-mohamedzah
// Find nearest library
function findNearestLibrary() {
  if (!userLocation) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          findNearestLibrary();
        },
        (error) => {
          alert(
            "Unable to determine your location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
    return;
  }

  // Sort by distance ascending
  filteredLibraries = sortLibraries(filteredLibraries, "distance", 1);
  renderLibraries(filteredLibraries);

  // Highlight the nearest one
  if (filteredLibraries.length > 0) {
    const nearest = filteredLibraries[0];
    const rows = document.querySelectorAll("#libraryTable tbody tr");
    for (const row of rows) {
      const nameCell = row.querySelector("td:first-child");
      if (nameCell && nameCell.textContent.trim() === nearest.properties.NAME) {
        row.classList.add("highlighted");
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          row.classList.remove("highlighted");
        }, 3000);
        break;
      }
    }
  }
}

function filterLibraries(searchTerm, selectedTown) {
  filteredLibraries = libraries.filter((library) => {
    const props = library.properties;
    const matchesSearch =
      props.NAME.toLowerCase().includes(searchTerm) ||
      props.STREET.toLowerCase().includes(searchTerm) ||
      props.TOWN.toLowerCase().includes(searchTerm) ||
      (props.POSTCODE && props.POSTCODE.toLowerCase().includes(searchTerm));
    const matchesTown = selectedTown === "" || props.TOWN === selectedTown;
    return matchesSearch && matchesTown;
  });

  // Default sort by name
  filteredLibraries = sortLibraries(filteredLibraries, "name", 1);
  renderLibraries(filteredLibraries);
}

function setupClearFilter() {
  const clearFilterButton = document.getElementById("clearFilter");

  clearFilterButton.addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("townFilter").value = "";
    filterLibraries("", "");
  });
}

fetchLibraries().then((data) => {
  libraries = data;
  filteredLibraries = libraries;
  renderLibraries(filteredLibraries);
  setupSearch();
  setupTownFilter();
  setupSorting();
  setupClearFilter();

  //Setup nearest library button
  document
    .getElementById("findNearest")
    .addEventListener("click", findNearestLibrary);
});

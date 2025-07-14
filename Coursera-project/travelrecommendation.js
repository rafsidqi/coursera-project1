// travelrecommendation.js

// Fetch data from JSON file
fetch("travelrecommendation.json")
  .then((response) => response.json())
  .then((data) => {
    const searchBtn = document.getElementById("searchbtn");
    const clearBtn = document.getElementById("clearbtn");
    const resultContainer = document.getElementById("resultContainer");
    const dropdown = document.getElementById("dropdown");
    const closeBtn = document.getElementById("close-btn");
    const searchInput = document.getElementById("searchinput");

    // Function to display recommendations
    const displayResult = (title, img, description, time) => {
      dropdown.classList.remove("hidden");
      resultContainer.innerHTML = `
        <h2 class="text-2xl font-bold text-blue-600 mb-2">${title}</h2>
        <img src="${img}" alt="${title}" class="rounded-lg shadow mb-2">
        <p class="text-gray-700 mb-2">${description}</p>
        ${time ? `<p class="text-sm text-gray-500">Local Time: ${time}</p>` : ""}
      `;
    };

    // Function to handle no results
    const displayNoResult = () => {
      dropdown.classList.remove("hidden");
      resultContainer.innerHTML = `<p class="text-red-600 font-semibold">Sorry, no matching destination found.</p>`;
    };

    // Function to fetch current local time using WorldTimeAPI
    const fetchLocalTime = async (location) => {
      try {
        const response = await fetch(`https://worldtimeapi.org/api/timezone`);
        const timezones = await response.json();
        const match = timezones.find(tz => tz.toLowerCase().includes(location.toLowerCase()));
        if (match) {
          const timeRes = await fetch(`https://worldtimeapi.org/api/timezone/${match}`);
          const timeData = await timeRes.json();
          return new Date(timeData.datetime).toLocaleTimeString();
        }
      } catch (error) {
        console.error("Error fetching time:", error);
      }
      return null;
    };

    // Main search function
    const search = async () => {
      const query = searchInput.value.trim().toLowerCase();
      let found = false;

      // Search in countries -> cities
      for (const country of data.countries) {
        for (const city of country.cities) {
          if (city.name.toLowerCase().includes(query)) {
            const time = await fetchLocalTime(city.name);
            displayResult(city.name, city.imageUrl, city.description, time);
            found = true;
            return;
          }
        }
      }

      // Search in temples
      for (const temple of data.temples) {
        if (temple.name.toLowerCase().includes(query)) {
          const time = await fetchLocalTime(temple.name);
          displayResult(temple.name, temple.imageUrl, temple.description, time);
          found = true;
          return;
        }
      }

      // Search in beaches
      for (const beach of data.beaches) {
        if (beach.name.toLowerCase().includes(query)) {
          const time = await fetchLocalTime(beach.name);
          displayResult(beach.name, beach.imageUrl, beach.description, time);
          found = true;
          return;
        }
      }

      if (!found) {
        displayNoResult();
      }
    };

    // Clear search
    const clearSearch = () => {
      searchInput.value = "";
      dropdown.classList.add("hidden");
    };

    // Event listeners
    searchBtn.addEventListener("click", search);
    clearBtn.addEventListener("click", clearSearch);
    closeBtn.addEventListener("click", clearSearch);
  })
  .catch((error) => console.error("Error loading data:", error));
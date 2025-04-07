// Makes array values to li elements and put them in an ul that exists in the html, and then one can make choices by clicking in the dropdown list
function dropdownSuggestions(array, list, input, button) {
  list.innerHTML = "";
  let innerText = "";
  array.forEach((arrayValue) => {
    innerText += `
      <li class="dropdown">${arrayValue}</li>`;
  });

  list.innerHTML = innerText;
  list.style.display = "block";
  list.addEventListener("click", (event) => {
    const value = event.target.innerText;
    input.value = value;
    list.style.display = "none";
    button.disabled = false;
  });
}

// Filters out, from an array, the values that include the input value
// (only used so far in the Settings anime quotes)
// function filterSearch(array, searchInput) {
//   return array.filter((x) =>
//     x.toLowerCase().includes(searchInput.toLowerCase())
//   );
// }

// Hides the dropdown when one clicks outside of it
document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown")) {
    const dropdown = document.querySelectorAll(".dropdown");
    for (let i = 0; i < dropdown.length; i++) {
      dropdown[i].style.display = "none";
    }
  }
});

const changeButton = document.querySelector("#change-button");
changeButton.disabled = true;

///////////////////////////////////////////////////////////////////
// Settings Västtrafik:

const vtInputStop = document.querySelector("#stop-name"),
  // vtButtonStop = document.querySelector("#stop-name-button"),
  vtSuggUl = document.querySelector("#vt-sugglist");
let filteredstopArray;

// vtButtonStop.disabled = true;

// get station by input name
function fetchStation(stationName) {
  // encode characters the so they work in query param
  const stopName = encodeURIComponent(stationName);

  fetch(`/api/vtstop.js?stopName=${stopName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log("fetchStation Resultat", result);
      console.log("fetchStation Resultat.results", result.results);

      let stopArray = [];

      // avoids general places id that cannot show as one station
      const firstFourStopLocations = result.results.slice(0, 4);

      const filteredStopLocations = firstFourStopLocations.filter(
        (location) =>
          location?.gid && location.gid.slice(0, 14) !== "00000008000000"
      );

      stopArray.push(...filteredStopLocations);

      // makes a list of object filtered to only the keys and values needed
      const selectedKeys = ["name", "gid"];

      filteredstopArray = stopArray.map((obj) =>
        selectedKeys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
      );

      let filtList = [];

      stopArray.forEach((obj) => {
        filtList.push(obj.name);
      });

      // makes so it's always three in the list that will be sent to the dropdownfunction and displayed in the dropdown
      if (filtList.length > 3) {
        filtList = filtList.slice(0, 3);
      }
      dropdownSuggestions(filtList, vtSuggUl, vtInputStop, changeButton);
    });
}

vtInputStop.addEventListener("input", () => {
  // vtButtonStop.disabled = true;
  changeButton.disabled = true;
  if (vtInputStop.value.length > 2) {
    fetchStation(vtInputStop.value);
  }
});

if (localStorage.getItem("vtInputStop")) {
  vtInputStop.setAttribute("placeholder", localStorage.getItem("vtInputStop"));
} else {
  localStorage.setItem("vtInputStop", "Nils Ericson Terminalen, Göteborg");
}

///////////////////////////////////////////////////////////////////
// Settings Weather:
// getting geocoding by https://papilite.se/

const weatherPlaceInput = document.querySelector("#set-weather-place"),
  weatherSuggUl = document.querySelector("#weather-sugglist");
let weatherPlaceArray = [];

function fetchLocation(place) {
  const locationName = encodeURIComponent(place);
  fetch(
    `https://api.papapi.se/lite/?query=${locationName}&format=json&apikey=***REMOVED***`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("LocationFetch", result);
      weatherPlaceArray = result.results.filter((item, index) => {
        const check =
          result.results.findIndex(
            (elem) => elem.city === item.city && elem.county === item.county
          ) === index;
        return check;
      });

      console.log("weatherPlaceArray", weatherPlaceArray);

      let placeList = [];

      weatherPlaceArray.forEach((obj) => {
        placeList.push(`${obj.city}, ${obj.county}`);
      });

      console.log("PLACElist", placeList);

      dropdownSuggestions(
        placeList,
        weatherSuggUl,
        weatherPlaceInput,
        changeButton
      );
    });
}

weatherPlaceInput.addEventListener("input", () => {
  changeButton.disabled = true;
  if (weatherPlaceInput.value.length > 2) {
    fetchLocation(weatherPlaceInput.value);
  }
});

if (localStorage.getItem("weatherPlace")) {
  weatherPlaceInput.setAttribute(
    "placeholder",
    localStorage.getItem("weatherPlace")
  );
} else {
  localStorage.setItem("weatherPlace", "Göteborg");
}

///////////////////////////////////////////////////////////////////
// Settings Anime quotes:
// ref. autocomplete-function with dropdown: https://www.youtube.com/watch?v=OPnPqc9YWSA
// the API info webpage: https://animechan.vercel.app/

// const animeList = [
//   "Fullmetal Alchemist",
//   "Death Note",
//   "Cowboy Bebop",
//   "Spirited Away",
//   "Princess Mononoke",
//   "Pokémon",
//   "(The) Melancholy of Haruhi Suzumiya",
//   "Elfen Lied",
//   "Neon Genesis Evangelion",
//   "Code Geass: Lelouch of the Rebellion",
//   "Bleach",
//   "Code Geass: Lelouch of the Rebellion R2",
//   "FLCL",
//   "Naruto",
//   "Samurai Champloo",
//   "Trigun",
//   "Gurren Lagann",
//   "Rurouni Kenshin: Trust & Betrayal",
//   "Howl's Moving Castle",
//   "movFull Metal Panic!",
//   "Ouran High School Host Club",
//   "Fullmetal Alchemist: Brotherhood",
//   "Clannad",
//   "Fruits Basket",
//   "Akira",
//   "Cowboy Bebop: The MoChobits",
//   "Full Metal Panic? Fumoffu",
//   "5 Centimeters Per Second",
//   "Rurouni Kenshin",
//   "(The) Girl Who Leapt Through Time",
//   "Ghost in the Shell",
//   "Clannad After Story",
//   "Hellsing",
//   "Final Fantasy VII: Advent Children",
//   "Azumanga Daioh",
//   "Fullmetal Alchemist: The Movie - Conqueror of Shamba",
//   "Ghost in the Shell: Stand Alone Complex",
//   "Nausicaä of the Valley of the Wind",
//   "Mushi-Shi",
//   "Darker than Black",
//   "Fate/stay night",
//   "Steins;Gate",
//   "Claymore",
//   "Toradora!",
//   "Inuyasha",
//   "Castle in the Sky",
//   "Full Metal Panic! The Second Raid",
//   "Black Lagoon",
//   "Blood+",
//   "Angel Beats!",
//   "Neon Genesis Evangelion: The End of Evangelion",
//   "My Neighbor Totoro",
//   "Grave of the Fireflies",
//   "Dragon Ball Z",
//   "Eureka Seven",
//   "Air",
//   "Love Hina",
//   "Berserk",
//   "Last Exile",
//   "When They Cry - Higurashi",
//   "GTO: Great Teacher Onizuka",
//   "Baccano!",
//   "Wolf's Rain",
//   "Welcome to the NHK",
//   "Sword Art Online",
//   "Serial Experiments Lain",
//   "Shakugan no Shana",
//   "Haibane Renmei",
//   "One Piece",
//   "Attack on Titan",
//   "Kiki's Delivery Service",
//   "Naruto Shippūden",
//   "(The) Vision of Escaflowne",
//   "Samurai 7",
//   "Soul Eater",
//   "Ergo Proxy",
//   "Black Lagoon: The Second Barrage",
//   "School Rumble",
//   "Spice and Wolf",
//   "Lucky Star",
//   "Eden of the East",
//   "Kanon",
//   "Gungrave",
//   "Dragon Ball",
//   "Puella Magi Madoka Magica",
//   "Monster",
//   "High School of the Dead",
//   "Summer Wars",
//   "Chrono Crusade",
//   "Bakemonogatari",
//   "anohana: The Flower We Saw That Day",
//   "Gunslinger Girl",
//   "Lunar Legend Tsukihime",
//   "(The) Familiar of Zero",
//   "R.O.D -The Read or Die",
//   "Yu Yu Hakusho: Ghost Files",
//   "Mobile Suit Gundam Seed",
//   "Durarara!!",
//   "Paranoia Agent",
// ];

// let animeBoxAnimeInput = document.querySelector("#set-anime"),
//   animeSuggUl = document.querySelector("#anime-sugglist");

// async function fetchAnimeBox(search) {
//   let getAnime = encodeURIComponent(search);
//   const result = await (
//     await fetch(
//       `https://animechan.vercel.app/api/random/anime?title=${getAnime}`
//     )
//   ).json();
//   console.log("RESULT ANIME AWAIT", result);
//   return result;
// }

// console.log("Värde", animeBoxAnimeInput.value);

// animeBoxAnimeInput.addEventListener("input", () => {
//   changeButton.disabled = true;
//   if (animeBoxAnimeInput.value.length > 2) {
//     const filteredSearch = filterSearch(animeList, animeBoxAnimeInput.value);

//     dropdownSuggestions(
//       filteredSearch,
//       animeSuggUl,
//       animeBoxAnimeInput,
//       changeButton
//     );
//   } else {
//     animeSuggUl.style.display = "none";
//   }
// });
// console.log("AAANIMEEE", animeBoxAnimeInput.value);

// if (localStorage.getItem("animeBoxAnime")) {
//   animeBoxAnimeInput.setAttribute(
//     "placeholder",
//     localStorage.getItem("animeBoxAnime")
//   );
// } else {
//   localStorage.setItem("animeBoxAnime", "Naruto");
// }
// localStorage.setItem(
//   "animeBoxQuote",
//   "As long as you don't give up, you can still be saved! -- Hatake Kakashi"
// );

changeButton.addEventListener("click", async () => {
  console.log("Change button clicked"); // Add this log to verify the click event works

  if (weatherPlaceInput.value !== "") {
    const weatherObjectSelected = weatherPlaceArray.filter((obj) =>
      weatherPlaceInput.value.includes(obj.city)
    );
    console.log("Weather object selected:", weatherObjectSelected);

    if (weatherObjectSelected && weatherObjectSelected.length > 0) {
      localStorage.setItem(
        "weatherLatitude",
        weatherObjectSelected[0].latitude
      );
      localStorage.setItem(
        "weatherLongitude",
        weatherObjectSelected[0].longitude
      );
      localStorage.setItem("weatherPlace", weatherObjectSelected[0].city);
      weatherPlaceInput.value = null;
    }
  }

  // if (animeBoxAnimeInput.value) {
  //   try {
  //     // Need to use await here since fetchAnimeBox returns a promise
  //     const animeResultArray = await fetchAnimeBox(animeBoxAnimeInput.value);
  //     console.log("Anime result:", animeResultArray);

  //     if (animeResultArray) {
  //       localStorage.setItem(
  //         "animeBoxQuote",
  //         `${animeResultArray.quote}  -- ${animeResultArray.character}  (${animeResultArray.anime})`
  //       );
  //       localStorage.setItem("animeBoxAnime", animeBoxAnimeInput.value);
  //       animeBoxAnimeInput.value = null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching anime quote:", error);
  //   }
  // }

  if (vtInputStop.value) {
    console.log("VT input stop value:", vtInputStop.value);
    console.log("Filtered stop array:", filteredstopArray);

    // Make sure filteredstopArray exists and has elements before filtering
    if (filteredstopArray && filteredstopArray.length > 0) {
      const vtObjectSelected = filteredstopArray.filter((obj) =>
        vtInputStop.value.includes(obj.name)
      );

      console.log("VT object selected:", vtObjectSelected);

      if (vtObjectSelected && vtObjectSelected.length > 0) {
        localStorage.setItem("vtInputStopId", vtObjectSelected[0].gid);
        localStorage.setItem("vtInputStop", vtInputStop.value);
        vtInputStop.value = null;
      } else {
        console.error("No matching stop found in filteredstopArray");
      }
    } else {
      console.error("filteredstopArray is undefined or empty");
    }
  }

  console.log("Reloading page...");
  location.reload();
});

// changeButton.addEventListener("click", () => {
//   // console.log("animeBoxAnimeInput.value", animeBoxAnimeInput.value);
//   console.log("filteredstopArray", filteredstopArray);
//   console.log("vtInputStop", vtInputStop);

//   if (weatherPlaceInput.value !== "") {
//     const weatherObjectSelected = weatherPlaceArray.filter((obj) =>
//       weatherPlaceInput.value.includes(obj.city)
//     );
//     // console.log(" weatherObjectSelected", weatherObjectSelected);
//     localStorage.setItem("weatherLatitude", weatherObjectSelected[0].latitude);
//     localStorage.setItem(
//       "weatherLongitude",
//       weatherObjectSelected[0].longitude
//     );
//     localStorage.setItem("weatherPlace", weatherObjectSelected[0].city);
//     weatherPlaceInput.value = null;
//   }
//   //
//   if (animeBoxAnimeInput.value) {
//     const animeResultArray = fetchAnimeBox(animeBoxAnimeInput.value);
//     // console.log("animeResultArray", animeResultArray);
//     localStorage.setItem(
//       "animeBoxQuote",
//       `${animeResultArray.quote}  -- ${animeResultArray.character}  (${animeResultArray.anime})`
//     );
//     localStorage.setItem("animeBoxAnime", animeBoxAnimeInput.value);
//     animeBoxAnimeInput.value = null;
//   }

//   // look for the object in filteredstopArray whoose key name has the same value as vtInputStop.value and from that object get the value of the key id

//   if (vtInputStop.value) {
//     const vtObjectSelected = filteredstopArray.filter((obj) =>
//       vtInputStop.value.includes(obj.name)
//     );
//     localStorage.setItem("vtInputStopId", vtObjectSelected[0].gid);
//     localStorage.setItem("vtInputStop", vtInputStop.value);
//     vtInputStop.value = null;
//   }
//   location.reload();
// });

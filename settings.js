///////////////////////////////////////////////////////////////////
//General functions:

// Makes array values to li elements and put them in an ul that exists in the htlm, and then one can make choices by clicking in the dropdown list
function dropdownSuggestions(array, list, input, button) {
  // console.log("JAJAJAJA");
  list.innerHTML = "";
  let innerText = "";
  array.forEach((arrayValue) => {
    innerText += `
      <li class="dropdown">${arrayValue}</li>`;
    // console.log("ArrayValue", arrayValue);
  });

  list.innerHTML = innerText;
  list.style.display = "block";
  list.addEventListener("click", (event) => {
    const value = event.target.innerText;
    // console.log("VALUE", event);
    input.value = value;
    list.style.display = "none";
    button.disabled = false;
  });
}

// Filters out, from an array, the values that include the input value
function filterSearch(array, searchInput) {
  return array.filter((x) =>
    x.toLowerCase().includes(searchInput.toLowerCase())
  );
}

// Hides the dropdown when one clicks outside of it
document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown")) {
    const dropdown = document.querySelectorAll(".dropdown");
    // console.log("DROPDOWN", dropdown);
    for (let i = 0; i < dropdown.length; i++) {
      if ((dropdown[i].style.display = "block")) {
        dropdown[i].style.display = "none";
      }
    }
  }
});

///////////////////////////////////////////////////////////////////
//Settings Västtrafik:

let stopId;
const vtInputStop = document.querySelector("#stop-name"),
  vtButtonStop = document.querySelector("#stop-name-button"),
  vtSuggUl = document.querySelector("#vt-sugglist");
let filteredList;

//get station by input name
function fetchStation(stationName) {
  console.log("Hallå " + stationName + "(i fetchStation)");

  // encode characters the so they work in query param
  const stopName = encodeURIComponent(stationName);

  fetch("https://api.vasttrafik.se/token", {
    body: "grant_type=client_credentials&scope=0",
    headers: {
      Authorization:
        "Basic MEVvUWFJNW9lbVVLajYwdWM2M3F5OUlDdlpJYTpxaXFUZWg4eFlmV0ZVMDAwMFBMYmZYSU1zeDhh",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((result) => {
      fetch(
        `https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=${stopName}&format=json`,
        {
          headers: {
            Authorization: `Bearer ${result.access_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("fetchStation Resultat", result);
          let stopArray = [];
          console.log(
            "IDDDDD",
            result.LocationList.StopLocation[0].id.slice(0, 13)
          );

          //avoids general places that cannot show as one station
          for (let i = 0; i < 3; i++) {
            if (
              result.LocationList.StopLocation[i].id.slice(0, 14) !==
              "00000008000000"
            ) {
              stopArray.push(result.LocationList.StopLocation[i]);
            }
          }
          console.log("STOParray", stopArray);

          const selectedKeys = ["name", "id"];

          filteredList = stopArray.map((obj) =>
            selectedKeys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
          );

          console.log("FILTERED", filteredList);

          ////////////////////////////////
          // ref varianter och exempel från ChatGPT, filter() vs. reduce()
          // const originalList = [
          //   { name: "Alice" },
          //   { age: 25 },
          //   { gender: "female" },
          //   { name: "Bob" },
          //   { age: 30 },
          //   { gender: "male" },
          //   { name: "Claire" },
          //   { age: 35 },
          //   { gender: "female" },
          //   { name: "David" },
          //   { age: 40 },
          //   { gender: "male" },
          // ];

          // console.log("ORIGINAL", originalList);

          // const selectedKeys = ["name", "age"];

          // const filteredList = originalList.filter((obj) => {
          //   return selectedKeys.some((key) => obj.hasOwnProperty(key));
          // });

          // console.log("FILTERED", filteredList);

          // const originalList = [
          //   { name: "Alice", age: 25, gender: "female" },
          //   { name: "Bob", age: 30, gender: "male" },
          //   { name: "Claire", age: 35, gender: "female" },
          //   { name: "David", age: 40, gender: "male" },
          // ];'

          // const selectedKeys = ["name", "age"];

          // const filteredList = originalList.map((obj) =>
          //   selectedKeys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
          // );

          // console.log(filteredList);
          ////////////////////////////////

          let filtArray = [];

          filteredList.forEach((obj) => {
            filtArray.push(obj.name);
          });

          console.log("PUSH", filtArray);
          console.log("VTinputSTOP", vtInputStop);

          dropdownSuggestions(filtArray, vtSuggUl, vtInputStop, vtButtonStop);
        });
    });
}

vtInputStop.addEventListener("input", () => {
  vtButtonStop.disabled = true;
  if (vtInputStop.value.length > 2) {
    fetchStation(vtInputStop.value);
  }
});

// console.log("VTInputStopppp", vtInputStop.value);

vtButtonStop.addEventListener("click", () => {
  console.log("VtButton", vtInputStop.value);
  // look for the object in filteredList whoose key name has the same value as vtInputStop.value and fronm that object get the value of the key id.
  const vtObjectSelected = filteredList.filter((obj) =>
    vtInputStop.value.includes(obj.name)
  );
  console.log("vtObjectSelected", vtObjectSelected[0].id);

  localStorage.setItem("vtInputStopId", vtObjectSelected[0].id);
  localStorage.setItem("vtInputStop", vtInputStop.value);
  vtInputStop.value = null;
  location.reload();
});

const lsVt = localStorage.getItem("vtInputStop");
vtInputStop.setAttribute(
  "placeholder",
  `${lsVt[0].toUpperCase()}${lsVt.slice(1).toLowerCase()}...`
);

// fetchStation(lsVt);
// //run the fetchStation-function:
// let xstation;

// if (localStorage.getItem("vtInputStopId") !== null) {
//   xstation = localStorage.getItem("vtInputStopId");
// } else {
//   xstation = "Nils Ericsson Terminalen";
//   localStorage.setItem("vtInputStopId", xstation);
// }

// fetchStation(xstation);

///////////////////////////////////////////////////////////////////
//Settings Weather:

const weatherPlaceInput = document.querySelector("#set-weather-place"),
  weatherPlaceButton = document.querySelector("#set-weather-place-button");

weatherPlaceButton.addEventListener("click", () => {
  // console.log("weatherButton", weatherPlaceInput.value);
  localStorage.setItem("weatherPlace", weatherPlaceInput.value);
  location.reload();
  weatherPlaceInput.value = null;
});

const phWeather = localStorage.getItem("weatherPlace");
weatherPlaceInput.setAttribute(
  "placeholder",
  `${phWeather[0].toUpperCase()}${phWeather.slice(1).toLowerCase()}...`
);

///////////////////////////////////////////////////////////////////
//Settings Anime quotes:
// ref. autocomplete-function with dropdown: https://www.youtube.com/watch?v=OPnPqc9YWSA
//the API info webpage: https://animechan.vercel.app/

const animeList = [
  "Fullmetal Alchemist",
  "Death Note",
  "Cowboy Bebop",
  "Spirited Away",
  "Princess Mononoke",
  "Pokémon",
  "(The) Melancholy of Haruhi Suzumiya",
  "Elfen Lied",
  "Neon Genesis Evangelion",
  "Code Geass: Lelouch of the Rebellion",
  "Bleach",
  "Code Geass: Lelouch of the Rebellion R2",
  "FLCL",
  "Naruto",
  "Samurai Champloo",
  "Trigun",
  "Gurren Lagann",
  "Rurouni Kenshin: Trust & Betrayal",
  "Howl's Moving Castle",
  "movFull Metal Panic!",
  "Ouran High School Host Club",
  "Fullmetal Alchemist: Brotherhood",
  "Clannad",
  "Fruits Basket",
  "Akira",
  "Cowboy Bebop: The MoChobits",
  "Full Metal Panic? Fumoffu",
  "5 Centimeters Per Second",
  "Rurouni Kenshin",
  "(The) Girl Who Leapt Through Time",
  "Ghost in the Shell",
  "Clannad After Story",
  "Hellsing",
  "Final Fantasy VII: Advent Children",
  "Azumanga Daioh",
  "Fullmetal Alchemist: The Movie - Conqueror of Shamba",
  "Ghost in the Shell: Stand Alone Complex",
  "Nausicaä of the Valley of the Wind",
  "Mushi-Shi",
  "Darker than Black",
  "Fate/stay night",
  "Steins;Gate",
  "Claymore",
  "Toradora!",
  "Inuyasha",
  "Castle in the Sky",
  "Full Metal Panic! The Second Raid",
  "Black Lagoon",
  "Blood+",
  "Angel Beats!",
  "Neon Genesis Evangelion: The End of Evangelion",
  "My Neighbor Totoro",
  "Grave of the Fireflies",
  "Dragon Ball Z",
  "Eureka Seven",
  "Air",
  "Love Hina",
  "Berserk",
  "Last Exile",
  "When They Cry - Higurashi",
  "GTO: Great Teacher Onizuka",
  "Baccano!",
  "Wolf's Rain",
  "Welcome to the NHK",
  "Sword Art Online",
  "Serial Experiments Lain",
  "Shakugan no Shana",
  "Haibane Renmei",
  "One Piece",
  "Attack on Titan",
  "Kiki's Delivery Service",
  "Naruto Shippūden",
  "(The) Vision of Escaflowne",
  "Samurai 7",
  "Soul Eater",
  "Ergo Proxy",
  "Black Lagoon: The Second Barrage",
  "School Rumble",
  "Spice and Wolf",
  "Lucky Star",
  "Eden of the East",
  "Kanon",
  "Gungrave",
  "Dragon Ball",
  "Puella Magi Madoka Magica",
  "Monster",
  "High School of the Dead",
  "Summer Wars",
  "Chrono Crusade",
  "Bakemonogatari",
  "anohana: The Flower We Saw That Day",
  "Gunslinger Girl",
  "Lunar Legend Tsukihime",
  "(The) Familiar of Zero",
  "R.O.D -The Read or Die",
  "Yu Yu Hakusho: Ghost Files",
  "Mobile Suit Gundam Seed",
  "Durarara!!",
  "Paranoia Agent",
];

let animeBoxAnimeInput = document.querySelector("#set-anime"),
  animeBoxAnimeButton = document.querySelector("#set-anime-button"),
  animeSuggUl = document.querySelector("#anime-sugglist");

animeBoxAnimeInput.addEventListener("input", () => {
  animeBoxAnimeButton.disabled = true;
  if (animeBoxAnimeInput.value.length > 2) {
    const filteredSearch = filterSearch(animeList, animeBoxAnimeInput.value);
    dropdownSuggestions(
      filteredSearch,
      animeSuggUl,
      animeBoxAnimeInput,
      animeBoxAnimeButton
    );
  } else {
    animeSuggUl.style.display = "none";
  }
});
console.log("AAANIMEEE", animeBoxAnimeInput.value);

function fetchAnimeBox(search) {
  let getAnime = encodeURIComponent(search);
  // console.log(getAnime);
  fetch(`https://animechan.vercel.app/api/random/anime?title=${getAnime}`)
    .then((response) => response.json())
    .then((quote) => {
      console.log(quote);
      localStorage.setItem(
        "animeBoxQuote",
        `${quote.quote}  -- ${quote.character}  (${quote.anime})`
      );
      localStorage.setItem("animeBoxAnime", search);
      animeBoxAnimeInput.value = null;
      location.reload();
    });
}

console.log("Värde", animeBoxAnimeInput.value);

animeBoxAnimeButton.addEventListener("click", () => {
  fetchAnimeBox(animeBoxAnimeInput.value);
  // console.log(animeBoxAnimeInput.value);
});

const phAnime = localStorage.getItem("animeBoxAnime");
animeBoxAnimeInput.setAttribute(
  "placeholder",
  `${phAnime[0].toUpperCase()}${phAnime.slice(1).toLowerCase()}...`
);

// let animeBoxAnimeInput = document.querySelector("#set-anime"),
//   animeBoxAnimeButton = document.querySelector("#set-anime-button");

// function fetchAnimeBox(search) {
//   let getAnime = encodeURIComponent(search);
//   // console.log(getAnime);
//   fetch(`https://animechan.vercel.app/api/random/anime?title=${getAnime}`)
//     .then((response) => response.json())
//     .then((quote) => {
//       console.log(quote);
//       localStorage.setItem(
//         "animeBoxQuote",
//         `${quote.quote}  -- ${quote.character}  (${quote.anime})`
//       );
//       localStorage.setItem("animeBoxAnime", search);
//       animeBoxAnimeInput.value = null;
//       location.reload();
//     });
// }

// animeBoxAnimeButton.addEventListener("click", () => {
//   fetchAnimeBox(animeBoxAnimeInput.value);
//   // console.log(animeBoxAnimeInput.value);
// });

// const phAnime = localStorage.getItem("animeBoxAnime");
// animeBoxAnimeInput.setAttribute(
//   "placeholder",
//   `${phAnime[0].toUpperCase()}${phAnime.slice(1).toLowerCase()}...`
// );

///////////////////////////////////////////////////////////////////
// Cities-tjänsten

const citiesInitialGetButton = document.querySelector(
    "#cities-initial-get-button"
  ),
  showCities = document.getElementById("settings-cities");

citiesInitialGetButton.addEventListener("click", getCities);

let citiesPatchButton,
  citiesDeleteButton,
  citiesGetButton,
  cityName = [];

function getCities() {
  let str;
  fetch("https://avancera.app/cities/")
    .then((sendFor) => sendFor.json())
    .then((got) => {
      // console.log("FETCHgetCITIES", got);
      str = `
      <h1>Cities-tjänsten</h1>

      <table class='temp-table'>Resultat:
      <tr>
        <th class='tempdiv-th'>Id: </th>
        <th class='tempdiv-th'>Namn: </th>
        <th class='tempdiv-th'>Antal invånare: </th>
      </tr>
       `;
      // console.log("STR", str);

      got.forEach((city) => {
        // console.log("GOT", got);
        cityName.push(city.name);
        str += `
      <tr  onClick="onClickTr(event)" class= 'tempdiv-tr' value='${city.id}' style=''>
        <td class= 'tempdiv-td' name= 'id' >${city.id}</td>
        <td class= 'tempdiv-td'><input class='temp-input' name= 'name' value='${city.name}'></></td>
        <td class= 'tempdiv-td'><input class='temp-input' name= 'pop' value='${city.population}'></></td>
      </tr>
        `;

        // console.log("STR2", str);
      });

      showCities.innerHTML = `${str}</table>
      <input id="cities-get-button" type="button" value="Hämta" />
      <input id="cities-patch-button" type="button" value="Spara" />
      <input id="cities-delete-button" type="button" value="Radera" />
      <form>
        <fieldset id="post-menu">
          <legend>Lägg till stad:</legend>
          <label for="post-name">Namn på staden: </label>
          <input id="post-name" type="text" placeholder="" />
          <label for="post-pop">Antal invånare i staden: </label>
          <input id="post-pop" type="text" placeholder="" value="0" />
          <input id="cities-post-button" type="button" value="Lägg till" />
        </fieldset>
      </form>
      `;

      const postName = document.querySelector("#post-name"),
        postPop = document.querySelector("#post-pop"),
        citiesPostButton = document.querySelector("#cities-post-button");
      let sendName, sendPop;
      citiesGetButton = document.querySelector("#cities-get-button");
      citiesPatchButton = document.querySelector("#cities-patch-button");
      citiesDeleteButton = document.querySelector("#cities-delete-button");

      citiesPostButton.disabled = true;
      citiesPatchButton.disabled = true;
      citiesDeleteButton.disabled = true;

      // to get again
      citiesGetButton.addEventListener("click", getCities);

      // for the Lägg till-function
      postName.addEventListener("input", () => {
        if (
          postName.value.trim() !== "" &&
          isNaN(postName.value.trim()) === true
        ) {
          citiesPostButton.disabled = false;
          sendName = postName.value;
        } else {
          citiesPostButton.disabled = true;
        }
      });
      postPop.addEventListener("input", () => {
        if (
          postPop.value.trim() !== "" &&
          isNaN(postPop.value.trim()) === false
        ) {
          citiesPostButton.disabled = false;
          sendPop = postPop.value;
        } else {
          citiesPostButton.disabled = true;
        }
      });

      citiesPostButton.addEventListener("click", () => {
        // console.log("SEND", sendName, sendPop);
        postCities(sendName, Number(sendPop));
      });

      // for the Redigera-function
      citiesPatchButton.addEventListener("click", () => {
        const trVarNodes = document.querySelectorAll(".tempdiv-tr");

        for (let i = 0; i < trVarNodes.length; i++) {
          let idCity, nameCity, popCity;

          idCity = trVarNodes[i].querySelectorAll("td")[0].textContent;
          nameCity = trVarNodes[i].querySelectorAll("td")[1].firstChild.value;
          popCity = trVarNodes[i].querySelectorAll("td")[2].firstChild.value;

          editCities(idCity, nameCity, Number(popCity), i);
          // console.log("FOR PatchButton", idCity, nameCity, Number(popCity), i);
        }
      });
    });
}

function onClickTr(event) {
  // onClick samt currentTarget ref: https://stackoverflow.com/questions/68634930/how-to-get-current-td-value-from-table-onclick

  // Turns on and shuts of the visual marking/highlight
  const tr = document.querySelectorAll("tr");
  tr.forEach((element) => {
    element.classList.remove("tr-clicked");
  });
  event.currentTarget.classList.add("tr-clicked");

  // Name and population:
  let onClickId = event.currentTarget.children[0].textContent,
    onClickName = event.currentTarget.children[1].children[0],
    patchName = event.currentTarget.children[1].children[0].value,
    onClickPop = event.currentTarget.children[2].children[0],
    patchPop = event.currentTarget.children[2].children[0].value;

  onClickName.addEventListener("input", () => {
    if (
      onClickName.value.trim() !== "" &&
      isNaN(onClickName.value.trim()) === true
    ) {
      citiesPatchButton.disabled = false;
      patchName = onClickName.value;
    } else {
      citiesPatchButton.disabled = true;
    }
  });

  onClickPop.addEventListener("input", () => {
    if (
      onClickPop.value.trim() !== "" &&
      isNaN(onClickPop.value.trim()) === false
    ) {
      citiesPatchButton.disabled = false;
      patchPop = onClickPop.value;
    } else {
      citiesPatchButton.disabled = true;
    }
  });

  citiesDeleteButton.disabled = false;

  // every id that has been clicked gets erased in theese two solutions below, fix so only the actual clicked city gets erased when one click the erase button

  // citiesDeleteButton.addEventListener("click", () => {
  //   deleteCities(onClickId);
  // });

  deleteCities(onClickId);
}

function postCities(name, pop) {
  fetch("https://avancera.app/cities/", {
    body: JSON.stringify({ name: name, population: pop }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      getCities();
    });
}

function editCities(id, namn, befolkning, i) {
  let stringifyArgument;

  if (namn === cityName[i]) {
    namn = null;
  }

  if (namn !== null && befolkning === 0) {
    stringifyArgument = { name: namn };
  } else if (namn === null && befolkning !== 0) {
    stringifyArgument = { population: befolkning };
  } else {
    stringifyArgument = { name: namn, population: befolkning };
  }
  // console.log("stringifyArgument", stringifyArgument);

  fetch("https://avancera.app/cities/" + id, {
    method: "PATCH",
    body: JSON.stringify(stringifyArgument),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json)
    .then((result) => {
      console.log(result);
      getCities();
    });
}

function deleteCities(idNum) {
  // console.log("ID", idNum);

  citiesDeleteButton.addEventListener("click", () => {
    fetch("https://avancera.app/cities/" + idNum, { method: "DELETE" }).then(
      (result) => {
        console.log(result);
        getCities();
      }
    );
  });
}
///////////////////////////////////////////////////////////////////
//ALLMÄNNA FUNKTIONER:

// gör array-värden till li-element och lägger in dem i en ul som finns i html och sedan kan en göra val genom att klicka i listan
function dropdownSuggestions(array, list, input, button) {
  console.log("JAJAJAJA");
  list.innerHTML = "";
  let innerText = "";
  array.forEach((arrayValue) => {
    innerText += `
      <li class="dropdown">${arrayValue}</li>`;
    console.log("ArrayValue", arrayValue);
  });

  list.innerHTML = innerText;
  list.style.display = "block";
  list.addEventListener("click", (event) => {
    const value = event.target.innerText;
    console.log("VALUE", event);
    input.value = value;
    list.style.display = "none";
    button.disabled = false;
  });
}

// filtrerar ut värden ur arrayen som innehåller inputvärdet
function filterSearch(array, searchInput) {
  return array.filter((x) =>
    x.toLowerCase().includes(searchInput.toLowerCase())
  );
}

//Hämta-knappen ska vara disabled när en ändrar i inputfältet (tills att en väljer något i dropdown, då blir den enabled)

///////////////////////////////////////////////////////////////////
//FÖR ATT ÄNDRA I VÄSTTRAFIK:
const vtInputStop = document.querySelector("#stop-name"),
  vtButtonStop = document.querySelector("#stop-name-button");

// vtInputStop.addEventListener("input", () => {
//   vtButtonStop.disabled = true;
//   if (vtInputStop.value.length > 2) {
//     const filteredSearch = filterSearch(vtList, vtInputStop.value);
//   }
// });

vtButtonStop.addEventListener("click", () => {
  // console.log("VtButton", vtInputStop.value);
  localStorage.setItem("vtInputStop", vtInputStop.value);
  location.reload();
  vtInputStop.value = null;
});

const phVt = localStorage.getItem("vtInputStop");
vtInputStop.setAttribute(
  "placeholder",
  `${phVt[0].toUpperCase()}${phVt.slice(1).toLowerCase()}...`
);

///////////////////////////////////////////////////////////////////
//FÖR ATT ÄNDRA I VÄDER:

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
//FÖR ATT ÄNDRA I ANIME:
// ref. autocomplete-funktion med dropdown: https://www.youtube.com/watch?v=OPnPqc9YWSA
//API'ns info-webbsida: https://animechan.vercel.app/

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

//efter den här har kört syns en dropdown-lista med de utfiltrerade arrayvärdena
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

      // för att hämta igen
      citiesGetButton.addEventListener("click", getCities);

      // för Lägg till-funktionen
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

      // för Redigera-funktionen
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

  // Tänder och släcker den visuella markeringen:
  const tr = document.querySelectorAll("tr");
  tr.forEach((element) => {
    element.classList.remove("tr-clicked");
  });
  event.currentTarget.classList.add("tr-clicked");

  // Namn och befolkning:
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

  // alla id-n som har blivit klickade på raderas med nedan två lösningar,fixa så att bara den aktuella markerade staden raderas när en trycker på radera-knappen

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

///////////////////////////////////////////////////////////////////
//FÖR ATT ÄNDRA I VÄSTTRAFIK:
const vtInputStop = document.querySelector("#stop-name"),
  vtButtonStop = document.querySelector("#stop-name-button");

vtButtonStop.addEventListener("click", () => {
  // console.log("VtButton", vtInputStop.value);
  localStorage.setItem("vtInputStop", vtInputStop.value);
  location.reload();
  vtInputStop.value = null;
});

vtInputStop.setAttribute(
  "placeholder",
  `${localStorage.getItem("vtInputStop")}...`
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

weatherPlaceInput.setAttribute(
  "placeholder",
  `${localStorage.getItem("weatherPlace")}...`
);

///////////////////////////////////////////////////////////////////
//FÖR ATT ÄNDRA I ANIME:
//API'ns info-webbsida: https://animechan.vercel.app/

let animeBoxAnimeInput = document.querySelector("#set-anime"),
  animeBoxAnimeButton = document.querySelector("#set-anime-button");

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

animeBoxAnimeButton.addEventListener("click", () => {
  fetchAnimeBox(animeBoxAnimeInput.value);
  // console.log(animeBoxAnimeInput.value);
});

animeBoxAnimeInput.setAttribute(
  "placeholder",
  `${localStorage.getItem("animeBoxAnime")}...`
);

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

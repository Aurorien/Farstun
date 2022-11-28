//////////////////////////////////////////////////////////
// Daybox

console.log("daybox");
const dayBox = document.getElementById("daybox");

function clock() {
  const dateDaybox = new Date(),
    time = dateDaybox.toTimeString();

  dayBox.textContent = `Datum: ${dateDaybox.toLocaleDateString(
    "sv-SE"
  )} \n\nTid: ${time.substring(0, 8)}`;
}

setInterval(clock, 1000);

///////////////////////////////////////////////////////////////////
// Västtrafik hållplatstablå
// API'er från: https://developer.vasttrafik.se/portal/#/
// ".../departureBoard, behöver man exempelvis inte anropa mer än var 10:e sekund, då data inte uppdateras mer frekvent än så."

let vtTdDpLine = document.querySelector("#td-dp-line"),
  vtTdDpNext = document.querySelector("#td-dp-next"),
  vtFirstDpSname = document.querySelector("#first-dp-sname"),
  vtFirstDpDirection = document.querySelector("#first-dp-direction"),
  vtFirstDpTime = document.querySelector("#first-dp-time"),
  vtSecondDpSname = document.querySelector("#second-dp-sname"),
  vtSecondDpDirection = document.querySelector("#second-dp-direction"),
  vtSecondDpTime = document.querySelector("#second-dp-time"),
  vtThirdDpSname = document.querySelector("#third-dp-sname"),
  vtThirdDpDirection = document.querySelector("#third-dp-direction"),
  vtThirdDpTime = document.querySelector("#third-dp-time"),
  vtStationp = document.querySelector("#vt-station-p"),
  departureboard,
  stopId;
/// för uppdatering av avgångstavlan med knappar:
// vtDpButton = document.querySelector("#vt-dp-button"),
// vtDpButtonStop = document.querySelector("#vt-dp-button-stop"), ///

//hämtar station via input av namnet
function fetchStation(stationName) {
  // console.log("Hallå " + stationName + "(i fetchStation)");
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
          stopId = result.LocationList.StopLocation[0].id;
          localStorage.setItem("saveStop", stopId);
          fetchVtData(stopId);
        });
    });
}

function fetchVtData(stationId) {
  // console.log("fetchData stationId:", JSON.stringify(stationId));

  if (stationId === null && localStorage.getItem("saveStop") === null) {
    stationId = "9021014004940000";
  }

  // Hämtar aktuellt datum och tid
  let date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    dayDate = date.getDate(),
    hour = date.getHours(),
    minuits = date.getMinutes();

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
        `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${stationId}&date=${year}-${month}-${dayDate}&time=${hour}%3A${minuits}&format=json`,
        {
          headers: {
            Authorization: `Bearer ${result.access_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log("fetchData Resultat", result);
          departureboard = result.DepartureBoard.Departure;
          console.log("Västtrafik", departureboard);

          // försök till fix av for-loop:

          // let vtext = new f();

          // for (let i = 0; i < 3; i++) {
          //   let number;

          //   if (i === 0) {
          //     number = "First";
          //   } else if (i === 1) {
          //     number = "Second";
          //   } else if (i === 2) {
          //     number = "Third";
          //   }

          //   console.log("this", this);
          //   console.log("hära", this["vt" + number + "DpSname"]);

          //   this["vt" + number + "DpSname"].textContent =
          //     departureboard[i].sname;
          //   this["vt" + number + "DpSname"].style.backgroundColor =
          //     departureboard[i].bgColor;
          //   this["vt" + number + "DpSname"].style.color =
          //     departureboard[i].fgColor;
          //   this["vt" + number + "DpDirection"].textContent =
          //     departureboard[i].direction;
          //   this["vt" + number + "DpTime"].textContent =
          //     departureboard[i].rtTime;
          // }

          // förbättringsförslag: går antagligen att fixa en for-loop  av det här ->

          vtFirstDpSname.textContent = departureboard[0].sname;
          vtFirstDpSname.style.backgroundColor = departureboard[0].bgColor;
          vtFirstDpSname.style.color = departureboard[0].fgColor;
          vtFirstDpDirection.textContent = departureboard[0].direction;
          vtFirstDpTime.textContent = departureboard[0].rtTime;

          vtSecondDpSname.textContent = departureboard[1].sname;
          vtSecondDpSname.style.backgroundColor = departureboard[1].bgColor;
          vtSecondDpSname.style.color = departureboard[1].fgColor;
          vtSecondDpDirection.textContent = departureboard[1].direction;
          vtSecondDpTime.textContent = departureboard[1].rtTime;

          vtThirdDpSname.textContent = departureboard[2].sname;
          vtThirdDpSname.style.backgroundColor = departureboard[2].bgColor;
          vtThirdDpSname.style.color = departureboard[2].fgColor;
          vtThirdDpDirection.textContent = departureboard[2].direction;
          vtThirdDpTime.textContent = departureboard[2].rtTime;

          vtStationp.textContent = departureboard[0].stop;

          //div-containern med avgångar visas först när fetch är klart med nedan kod
          document.querySelector("#vtbox").style.display = "block";
        });
    });
}

//kör fetchStation-funktionen:
let xstation;

if (localStorage.getItem("vtInputStop") !== null) {
  xstation = localStorage.getItem("vtInputStop");
} else {
  xstation = "Nils Ericsson Terminalen";
  localStorage.setItem("vtInputStop", xstation);
}

fetchStation(xstation);

//uppdaterar avgångstavlan i intervall:
setInterval(() => {
  fetchVtData(localStorage.getItem("saveStop"));
}, 15000);

//ALTERNATIVA VISNINGAR/UPPDATERINGAR AV AVGÅNGSTAVLAN:
//Uppdaterar avgångstavlan en gång per klick med tidsbestämd delay:
// vtDpButton.addEventListener("click", () => {
//   let currStop = localStorage.getItem("saveStop");
//   console.log(currStop);
//   fetchVtData(currStop);
//   console.log("fetchVtDataTIMEOUT", fetchVtData);
// });

//Kontinuerlig uppdatering med ett tidsintervall
//(https://avgangstavla.vasttrafik.se/?source=vasttrafikse-depatureboardlinkgenerator&stopAreaGid=9021014004940000 : den uppdaterar var 15 sekunder)

// setTimeout(fetchVtData);
// let update;
// vtDpButton.addEventListener("click", () => {
//   update = setInterval(fetchVtData, 1000);
// });

// // Avslutar setIntervall stänger av:
// vtDpButtonStop.addEventListener("click", () => {
//   clearInterval(update);
// });

///////////////////////////////////////////////////////////////////
//Animebox

let animeBox = document.querySelector("#animebox"),
  x;

if (localStorage.getItem("animeBoxAnime") !== null) {
  x = encodeURIComponent(localStorage.getItem("animeBoxAnime"));
} else {
  x = "Naruto";
  localStorage.setItem("animeBoxAnime", x);
}

fetch(`https://animechan.vercel.app/api/random/anime?title=${x}`)
  .then((response) => response.json())
  .then((quote) => {
    console.log(quote);
    if (localStorage.getItem("animeBoxQuote") !== null) {
      animeBox.textContent = localStorage.getItem("animeBoxQuote");
    } else {
      animeBox.textContent = `${quote.quote}  -- ${quote.character}  (${quote.anime})`;
    }
  });

///////////////////////////////////////////////////////////////////
//Weatherbox (SMHI)
//(Ex. : https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/11.914579/lat/57.687521/data.json -Meterologiska data över punkt i Göteborg)
//
//MED PLATSSÖKNING (funkar ej med sökvariabler i adressen som i nedan variant):

// const weatherTempNow = document.querySelector("#weather-temp-now"),
//   weatherH2Temp = document.querySelector("#weather-h2-temp");

// let place, lon, lat, city;

// if (localStorage.getItem("weatherPlace") !== null) {
//   place = localStorage.getItem("weatherPlace");
// } else {
//   place = "Göteborg";
// }

// fetchLocation(place);

// function fetchLocation(place) {
//   console.log("Place i fetchLocation", place);
//   fetch(
//     `https://api.papapi.se/lite/?query=${place}&format=json&apikey=***REMOVED***`
//   )
//     .then((response) => response.json())
//     .then((result) => {
//       console.log("LocationFetch", result);
//       localStorage.setItem("lon", result.results[0].longitude);
//       localStorage.setItem("lat", result.results[0].latitude);
//       localStorage.setItem("city", result.results[0].city);

//       weatherH2Temp.textContent = `Temperatur i ${city}`;
//       console.log(weatherH2Temp.textContent);

//       console.log("LonLat i fetchLocation", lon, lat);
//     });
// }

// lon = localStorage.getItem("lon");
// lat = localStorage.getItem("lat");
// city = localStorage.getItem("city");

// console.log("LonLAT Ute", lon, lat);
// fetchWeather(lon, lat);

// function fetchWeather(lon, lat) {
//   let longitud = lon,
//     latitud = lat;
//   console.log("LonLat i fetchweather", longitud, latitud);
//   let string = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitud}/lat/${latitud}/data.json`;

//   console.log(string);
//   fetch(
//     `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitud}/lat/${latitud}/data.json`
//   )
//     .then((response) => response.json())
//     .then((now) => {
//       console.log("weather", now);
//       console.log("weatherTemp", now.timeSeries[0].parameters[10].values[0]);
//       weatherTempNow.textContent = `${now.timeSeries[0].parameters[10].values[0]}  ºC`;
//     });
// }

////////////////////////////
//UTAN PLATSSÖKNING (funkar utan sökvariabler i adressen som i följande varaiant):

// const weatherTemp = document.querySelector("#weather-temp-now"),
//   weatherH2Temp = document.querySelector("#weather-h2-temp");

// fetch(
//   `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/11.97456/lat/57.708870/data.json`
// )
//   .then((response) => response.json())
//   .then((now) => {
//     console.log("weather", now);
//     console.log("weatherTempNow", now.timeSeries[0].parameters[10].values[0]);
//     weatherTempNow.textContent = `${now.timeSeries[0].parameters[10].values[0]}  ºC`;
//   });

/////////////////////////////
//TESTAR LIKT MED SMHI FAST MED https://openweathermap.org/current
// Hämtar plats via api från https://papilite.se/
//(för gratisversionen kan en göra 1000 anrop/månad)
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=***REMOVED***
//(för gratisversionen kan en göra max ett anrop var 14,5 min)

const weatherH2Temp = document.querySelector("#weather-h2-temp"),
  weatherTempNow = document.querySelector("#weather-temp-now"),
  weatherTempForecast = document.querySelector("#weather-temp-forecast"),
  weatherH2Pcpn = document.querySelector("#weather-h1-pcpn"),
  weatherPcpnNow = document.querySelector("#weather-pcpn-now"),
  weatherPcpnForecast = document.querySelector("#weather-pcpn-forecast"),
  weatherH2Wind = document.querySelector("#weather-h2-wind"),
  weatherWindNow = document.querySelector("#weather-wind-now"),
  weatherWindForecast = document.querySelector("#weather-wind-forecast"),
  weatherH2Sun = document.querySelector("#weather-h2-sun"),
  weatherSunrise = document.querySelector("#weather-sunrise"),
  weatherSunset = document.querySelector("#weather-sunset");

let place,
  lon,
  lat,
  city,
  sunrise,
  sunset,
  canvas = null;

function weatherStart() {
  if (localStorage.getItem("weatherPlace") !== null) {
    place = localStorage.getItem("weatherPlace");
  } else {
    place = "Göteborg";
    localStorage.setItem("weatherPlace", place);
  }

  fetchLocation(place);
}

function fetchLocation(place) {
  fetch(
    `https://api.papapi.se/lite/?query=${place}&format=json&apikey=***REMOVED***`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("LocationFetch", result);
      let lon = result.results[0].longitude,
        lat = result.results[0].latitude,
        city = result.results[0].city;

      weatherH2Pcpn.textContent = `Väder i ${city}`;

      fetchWeather(lon, lat);
      fetchForecast(lon, lat);
    });
}

function fetchWeather(lon, lat) {
  // vädret just nu
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=se&units=metric&appid=***REMOVED***`
  )
    .then((response) => response.json())
    .then((now) => {
      console.log("weather", now);
      console.log("weatherTempNow", now.main.temp);

      // ref: https://www.epochconverter.com/programming/#javascript
      sunrise = new Date(now.sys.sunrise * 1000);
      sunset = new Date(now.sys.sunset * 1000);

      const rise = sunrise.toTimeString(),
        set = sunset.toTimeString();

      weatherTempNow.textContent = `${now.main.temp}  ºC`;
      weatherWindNow.textContent = `${now.wind.speed} m/s`;
      weatherPcpnNow.textContent = `${now.weather[0].description}`;
      weatherSunrise.textContent = ` Upp:  ${rise.substring(0, 5)}`;
      weatherSunset.textContent = ` Ner:  ${set.substring(0, 5)}`;
    });
}

function fetchForecast(lon, lat) {
  // prognos i tretimmars-intervaller
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=se&units=metric&appid=***REMOVED***`
  )
    .then((response) => response.json())
    .then((forecast) => {
      console.log("Forecast", forecast);

      weatherWindForecast.textContent = "";
      weatherPcpnForecast.textContent = "";
      weatherTempForecast.textContent = "";

      for (let i = 0; i < 3; i++) {
        const fwinddt = forecast.list[i].dt_txt,
          fweatherdt = forecast.list[i].dt_txt,
          ftempdt = forecast.list[i].dt_txt;

        weatherWindForecast.textContent += ` ${fwinddt.substring(11, 16)} :  ${
          forecast.list[i].wind.speed
        } m/s  \n`;
        weatherPcpnForecast.textContent += `${fweatherdt.substring(
          10,
          16
        )} :  ${forecast.list[i].weather[0].description} \n`;
        weatherTempForecast.textContent += `${ftempdt.substring(10, 16)} :  ${
          forecast.list[i].main.temp
        } ºC  \n`;
      }

      chartTemp(forecast);
    });
}

weatherStart();
setInterval(weatherStart, 12000000);

///////////////////////////////////////////////////////////////////
// Chart.js
// ref: https://www.chartjs.org/docs/latest/getting-started/

let chartArray = [];

function chartTemp(forecast) {
  for (let i = 0; i < 5; i++) {
    chartArray.push(forecast.list[i].main.temp);
  }
  // console.log("CHARTARRAY", chartArray);
  const labels = ["Idag", "Imorgon", "om 2 dagar", "om 3 dagar", "om 4 dagar"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Dagstemperatur 5-dagarsprognos",
        backgroundColor: "#483758",
        borderColor: "#46315b",
        data: chartArray,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };

  if (canvas === null) {
    canvas = new Chart(document.getElementById("canvas"), config);
  } else {
    canvas.update(config);
  }
}

///////////////////////////////////////////////////////////////////
// Hamburgarmeny

const burger = document.querySelector("#burger-index");

function onBurgerClick() {
  const insideBurger = document.querySelector("#link-index"),
    burgerIndex = document.querySelector("#burger-index");

  if (insideBurger.style.display === "block") {
    insideBurger.style.display = "none";
    burgerIndex.setAttribute("class", "bi bi-list");
    // alternativt (ref: kursens Live-kodning):
    // burgerIndex.classList.remove("bi-x-lg");
    // burgerIndex.classList.add("bi-list");
  } else {
    insideBurger.style.display = "block";
    burgerIndex.setAttribute("class", "bi bi-x-lg");
    // alternativt:
    // burgerIndex.classList.remove("bi-list");
    // burgerIndex.classList.add("bi-x-lg");
  }
}

burger.addEventListener("click", onBurgerClick);

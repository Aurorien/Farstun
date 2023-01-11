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
// Västtrafik stop departureboard
// APIs from: https://developer.vasttrafik.se/portal/#/
// ".../departureBoard, behöver man exempelvis inte anropa mer än var 10:e sekund, då data inte uppdateras mer frekvent än så."

let vtTdDpLine = document.querySelector("#td-dp-line"),
  vtTdDpNext = document.querySelector("#td-dp-next"),
  vtTable = document.querySelector("#vt-dp-table"),
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
  departureboard;
/// for updating the departureboard with buttons:
// vtDpButton = document.querySelector("#vt-dp-button"),
// vtDpButtonStop = document.querySelector("#vt-dp-button-stop"), ///

function fetchVtData(stationId) {
  // console.log("fetchData stationId:", JSON.stringify(stationId));

  if (stationId === null && localStorage.getItem("vtInputStopId") === null) {
    stationId = "9021014004940000";
  }

  console.log("STATIONid", stationId);

  // Retrieves the current date and time
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
          console.log("fetchData Resultat", result);
          departureboard = result.DepartureBoard.Departure;
          console.log("Västtrafik", departureboard);

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

          //the div-containern with departures is only displayed when the fetch is finished with the code below
          document.querySelector("#vtbox").style.display = "block";
        });
    });
}

fetchVtData(localStorage.getItem("vtInputStopId"));
//updates the departureboard in intervals:
setInterval(() => {
  fetchVtData(localStorage.getItem("vtInputStopId"));
}, 15000);

//ALTERNATE DISPLAYS/UPDATES OF THE DEPARTURE BOARD:
//Updates the departure board once per click with a timed delay:
// vtDpButton.addEventListener("click", () => {
//   let currStop = localStorage.getItem("saveStop");
//   console.log(currStop);
//   fetchVtData(currStop);
//   console.log("fetchVtDataTIMEOUT", fetchVtData);
// });

//Continuous update with a time interval:
//(https://avgangstavla.vasttrafik.se/?source=vasttrafikse-depatureboardlinkgenerator&stopAreaGid=9021014004940000 : it updates every 15 seconds)

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
//Animebox:

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
    animeBox.textContent = `${quote.quote}  -- ${quote.character}  (${quote.anime})`;
    // if (localStorage.getItem("animeBoxQuote") !== null) {
    //   animeBox.textContent = localStorage.getItem("animeBoxQuote");
    // } else {
    //   animeBox.textContent = `${quote.quote}  -- ${quote.character}  (${quote.anime})`;
    // }
  });

///////////////////////////////////////////////////////////////////
//Weatherbox:
// https://openweathermap.org/
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=***REMOVED***

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
  if (localStorage.getItem("weatherLatitude") !== null) {
    latitude = localStorage.getItem("weatherLatitude");
    longitude = localStorage.getItem("weatherLongitude");
    console.log("LON LAT", longitude, latitude);
  } else {
    latitude = "57.7088700";
    longitude = "11.9745600";
    localStorage.setItem("weatherLatitude", latitude);
    localStorage.setItem("weatherLongitude", longitude);
  }
  weatherH2Pcpn.textContent = `Väder i ${localStorage.getItem("weatherPlace")}`;
  fetchWeather(latitude, longitude);
  fetchForecast(latitude, longitude);
}

function fetchWeather(lat, lon) {
  // the weather right now
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
  // forecast in three hours intervals
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
// Path to Settings

const gear = document.querySelector("#gear-index");

function onBurgerClick() {
  const insideBurger = document.querySelector("#link-index");

  if (insideBurger.style.display === "block") {
    insideBurger.style.display = "none";
  } else {
    insideBurger.style.display = "block";
  }
}

//ALTERNATIVE: HAMBURGER MENU

// const burger = document.querySelector("#burger-index");

// function onBurgerClick() {
//   const insideBurger = document.querySelector("#link-index"),
//     burgerIndex = document.querySelector("#burger-index");

//   if (insideBurger.style.display === "block") {
//     insideBurger.style.display = "none";
//     burgerIndex.setAttribute("class", "bi bi-list");
//     // alternativt (ref: kursens Live-kodning):
//     // burgerIndex.classList.remove("bi-x-lg");
//     // burgerIndex.classList.add("bi-list");
//   } else {
//     insideBurger.style.display = "block";
//     burgerIndex.setAttribute("class", "bi bi-x-lg");
//     // alternativt:
//     // burgerIndex.classList.remove("bi-list");
//     // burgerIndex.classList.add("bi-x-lg");
//   }
// }

// burger.addEventListener("click", onBurgerClick);

// gear.addEventListener("click", onBurgerClick);

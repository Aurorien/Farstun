//////////////////////////////////////////////////////////
// Daybox

const dayBoxDate = document.getElementById("date");
const dayBoxTime = document.getElementById("time");

function clock() {
  const dateDaybox = new Date(),
    time = dateDaybox.toTimeString();

  dayBoxDate.textContent = `${dateDaybox.toLocaleDateString("sv-SE")}`;

  dayBoxTime.textContent = `${time.substring(0, 8)}`;
}

const oneSecond = 1000;
setInterval(clock, oneSecond);

///////////////////////////////////////////////////////////////////
// Västtrafik stop departureboard
// APIs from: https://developer.vasttrafik.se/portal/#/
// ".../departureBoard, behöver man exempelvis inte anropa mer än var 10:e sekund, då data inte uppdateras mer frekvent än så."

let // vtTdDpLine = document.querySelector("#td-dp-line"),
  //   vtTdDpNext = document.querySelector("#td-dp-next"),
  //   vtTable = document.querySelector("#vt-dp-table"),
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
/// for version updating the departureboard with buttons:
// vtDpButton = document.querySelector("#vt-dp-button"),
// vtDpButtonStop = document.querySelector("#vt-dp-button-stop"), ///

function fetchVtData(stationId) {
  if (stationId === null && localStorage.getItem("vtInputStopId") === null) {
    stationId = "9021014004940000";
  }

  fetch(`/api/vtdepartures.js?stationId=${stationId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      departureboard = result.results;
      // en början på en variant (av Jon):
      // const a = [vtFirstDpSname, vtSecondDpSname, vtThirdDpSname];

      // troligen en lösning som fixar hela paketet med en loop (av Jon):
      // const trs = document.querySelector("tr");

      // // Skip first tr due to headings
      // for (let n = 1; n < trs.length; n++) {
      //   trs[n].querySelector(".sname").textContent =
      //     departureboard[n].sname;
      //   trs[n].querySelector(".direction").textContent =
      //     departureboard[n].sname;
      //   trs[n].querySelector(".time").textContent = departureboard[n].sname;
      // }
      function getTimeDifference(dateTime) {
        const departureTime = new Date(dateTime),
          now = new Date(),
          diff = departureTime - now,
          diffInMinutes = Math.floor(diff / 1000 / 60);

        if (diffInMinutes < 1) {
          return `Now`;
        } else {
          return `${diffInMinutes} min.`;
        }
      }

      vtFirstDpSname.textContent = departureboard[0]
        ? departureboard[0].serviceJourney.line.shortName
        : "";
      vtFirstDpSname.style.backgroundColor = departureboard[0]
        ? departureboard[0].serviceJourney.line.backgroundColor
        : "";
      vtFirstDpSname.style.color = departureboard[0]
        ? departureboard[0].serviceJourney.line.foregroundColor
        : "";
      vtFirstDpDirection.textContent = departureboard[0]
        ? departureboard[0].serviceJourney.direction
        : "";
      vtFirstDpTime.textContent = departureboard[0]
        ? getTimeDifference(departureboard[0].estimatedTime)
        : "";

      vtSecondDpSname.textContent = departureboard[1]
        ? departureboard[1].serviceJourney.line.shortName
        : "";
      vtSecondDpSname.style.backgroundColor = departureboard[1]
        ? departureboard[1].serviceJourney.line.backgroundColor
        : "";
      vtSecondDpSname.style.color = departureboard[1]
        ? departureboard[1].serviceJourney.line.foregroundColor
        : "";
      vtSecondDpDirection.textContent = departureboard[1]
        ? departureboard[1].serviceJourney.direction
        : "";
      vtSecondDpTime.textContent = departureboard[1]
        ? getTimeDifference(departureboard[1].estimatedTime)
        : "";

      vtThirdDpSname.textContent = departureboard[2]
        ? departureboard[2].serviceJourney.line.shortName
        : "";
      vtThirdDpSname.style.backgroundColor = departureboard[2]
        ? departureboard[2].serviceJourney.line.backgroundColor
        : "";
      vtThirdDpSname.style.color = departureboard[2]
        ? departureboard[2].serviceJourney.line.foregroundColor
        : "";
      vtThirdDpDirection.textContent = departureboard[2]
        ? departureboard[2].serviceJourney.direction
        : "";
      vtThirdDpTime.textContent = departureboard[2]
        ? getTimeDifference(departureboard[2].estimatedTime)
        : "";

      vtStationp.textContent = departureboard[0].stopPoint.name;

      //the div-containern with departures is only displayed when the fetch is finished with the code below
      document.querySelector("#vtbox").style.display = "block";
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
//   fetchVtData(currStop);
// });

//Continuous update with a time interval:

//(10 seconds is instructed as the shortest update time because the backend doesn't provide new information more often than that, this departureboard page by Västtrafik updates every 15 seconds: https://avgangstavla.vasttrafik.se/?source=vasttrafikse-depatureboardlinkgenerator&stopAreaGid=9021014004940000)

// setTimeout(fetchVtData);
// let update;
// vtDpButton.addEventListener("click", () => {
//   update = setInterval(fetchVtData, 15000);
// });

// // Shuts off setIntervall:
// vtDpButtonStop.addEventListener("click", () => {
//   clearInterval(update);
// });

///////////////////////////////////////////////////////////////////
//Animebox:

// let animeQuote = document.querySelector("#animequote"),
//   animeChar = document.querySelector("#animechar"),
//   animeTitle;

// if (localStorage.getItem("animeBoxAnime")) {
//   animeTitle = encodeURIComponent(localStorage.getItem("animeBoxAnime"));
// } else {
//   animeTitle = "Naruto";
//   localStorage.setItem("animeBoxAnime", animeTitle);
// }

// fetch(`https://animechan.xyz/api/random/anime?title=${animeTitle}`)
//   .then((response) => response.json())
//   .then((quote) => {
//     animeQuote.textContent = `"${quote.quote}"`;
//     animeChar.textContent = `-- ${quote.character}  (${quote.anime})`;
//   });

///////////////////////////////////////////////////////////////////
//Weatherbox:
// https://openweathermap.org/
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=***REMOVED***

const weatherTempNow = document.querySelector("#weather-temp-now"),
  weatherTempForecast = document.querySelector("#weather-temp-forecast"),
  weatherH2Pcpn = document.querySelector("#weather-h1-pcpn"),
  weatherPcpnNow = document.querySelector("#weather-pcpn-now"),
  weatherPcpnForecast = document.querySelector("#weather-pcpn-forecast"),
  weatherWindNow = document.querySelector("#weather-wind-now"),
  weatherWindForecast = document.querySelector("#weather-wind-forecast"),
  weatherSunrise = document.querySelector("#weather-sunrise"),
  weatherSunset = document.querySelector("#weather-sunset");

let longitude,
  latitude,
  sunrise,
  sunset,
  canvas = null;

function weatherStart() {
  if (localStorage.getItem("weatherLatitude") !== null) {
    latitude = localStorage.getItem("weatherLatitude");
    longitude = localStorage.getItem("weatherLongitude");
  } else {
    latitude = "57.7088700";
    longitude = "11.9745600";
    localStorage.setItem("weatherLatitude", latitude);
    localStorage.setItem("weatherLongitude", longitude);
  }

  if (localStorage.getItem("weatherPlace")) {
    weatherH2Pcpn.textContent = `${localStorage.getItem("weatherPlace")}`;
  } else {
    weatherH2Pcpn.textContent = `Göteborg`;
  }

  fetchWeatherData(latitude, longitude);
}

async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(`/api/weather.js?lat=${lat}&lon=${lon}`);
    const data = await response.json();

    if (response.ok) {
      const now = data.current;
      const forecast = data.forecast;

      // Process current weather
      sunrise = new Date(now.sys.sunrise * 1000);
      sunset = new Date(now.sys.sunset * 1000);
      const rise = sunrise.toTimeString(),
        set = sunset.toTimeString();

      weatherTempNow.textContent = `${now.main.temp} ºC`;
      weatherWindNow.textContent = `${now.wind.speed} m/s`;
      weatherPcpnNow.textContent = `${now.weather[0].description}`;
      weatherSunrise.textContent = `${rise.substring(0, 5)}`;
      weatherSunset.textContent = `${set.substring(0, 5)}`;

      // Process forecast
      weatherWindForecast.textContent = "";
      weatherPcpnForecast.textContent = "";
      weatherTempForecast.textContent = "";

      for (let i = 0; i < 3; i++) {
        const fwinddt = forecast.list[i].dt_txt,
          fweatherdt = forecast.list[i].dt_txt,
          ftempdt = forecast.list[i].dt_txt;

        weatherWindForecast.textContent += ` ${fwinddt.substring(11, 16)} : ${
          forecast.list[i].wind.speed
        } m/s \n`;
        weatherPcpnForecast.textContent += `${fweatherdt.substring(10, 16)} : ${
          forecast.list[i].weather[0].description
        } \n`;
        weatherTempForecast.textContent += `${ftempdt.substring(10, 16)} : ${
          forecast.list[i].main.temp
        } ºC \n`;
      }

      chartTemp(forecast);
    } else {
      console.error("Error fetching weather:", data.error);
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}

weatherStart();
setInterval(weatherStart, 12000000); // 3.3 hours

///////////////////////////////////////////////////////////////////
// Chart.js
// ref: https://www.chartjs.org/docs/latest/getting-started/

let chartArray = [];

function chartTemp(forecast) {
  for (let i = 0; i < 5; i++) {
    chartArray.push(forecast.list[i].main.temp);
  }
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

// const gear = document.querySelector("#gear-index");

// function onBurgerClick() {
//   const insideBurger = document.querySelector("#link-index");

//   if (insideBurger.style.display === "block") {
//     insideBurger.style.display = "none";
//   } else {
//     insideBurger.style.display = "block";
//   }
// }

// gear.addEventListener("click", onBurgerClick);

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

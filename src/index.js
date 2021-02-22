let apiKey = "5818bec111a0fe8b9841f56c8bff44c7";
let celsiusTemp = null;
let forecast = null;
let weatherIcons = {
  Clear: "Sunny.gif",
  Clouds: "Cloudy.gif",
  Drizzle: "ShowersDrizzle.gif",
  Rain: "Rain.gif",
  Thunderstorm: "Thunderstorms.gif",
  Snow: "Snow.gif",
  Mist: "FogFrostHaze.gif",
  Smoke: "FogFrostHaze.gif",
  Haze: "FogFrostHaze.gif",
  Dust: "FogFrostHaze.gif",
  Fog: "FogFrostHaze.gif",
  Sand: "FogFrostHaze.gif",
  Ash: "FogFrostHaze.gif",
  Squall: "FogFrostHaze.gif",
  Tornado: "FogFrostHaze.gif",
};

function formatHours(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function formatDate(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  let monthDate = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let year = date.getFullYear();
  let months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  return `${day} ${month} ${monthDate}, ${hours}:${minutes}, ${year}`;
}

function searchCity() {
  let searchInput = document.querySelector("#search-city");
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);

  searchInput.value = "";
}

function searchCityEnter(event) {
  if (event.keyCode === 13) {
    searchCity();
  }
}

function displayForecast(response) {
  let timeRow = document.querySelector("#forecast-time-row");
  timeRow.innerHTML = `<th scope="row" class="forecast-labels">Time</th>`;

  let degreeRow = document.querySelector("#forecast-degree-row");
  degreeRow.innerHTML = `<th scope="row" class="forecast-labels">Temp</th>`;

  let conditionRow = document.querySelector("#forecast-condition-row");
  conditionRow.innerHTML = `<th scope="row" class="forecast-labels">Condition</th>`;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    timeRow.innerHTML += `
      <td>${formatHours(forecast.dt)}</td>
    `;
    degreeRow.innerHTML += `
      <td>${Math.round(forecast.main.temp)}</td>
    `;
    conditionRow.innerHTML += `
      <td class="p-0">
        <img
          class="weather-icon-first"
          src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
          alt=""
        />
      </td>
    `;
  }
}

function displayWeather(response) {
  let currentDegree = document.querySelector("#current-degree");
  celsiusTemp = Math.round(response.data.main.temp);
  currentDegree.innerHTML = `${celsiusTemp} `;

  let descriptionDiv = document.querySelector("#description");
  let description = response.data.weather[0].description;
  descriptionDiv.innerHTML = description;

  let sunsetDiv = document.querySelector("#sunset");
  let sunset = response.data.sys.sunset;
  sunsetDiv.innerHTML = formatHours(sunset);

  let sunriseDiv = document.querySelector("#sunrise");
  let sunrise = response.data.sys.sunrise;
  sunriseDiv.innerHTML = formatHours(sunrise);

  let humidityDiv = document.querySelector("#humidity");
  let humidity = response.data.main.humidity;
  humidityDiv.innerHTML = humidity;

  let feelsLikeDiv = document.querySelector("#feels-like");
  let feelsLike = response.data.main.feels_like;
  feelsLikeDiv.innerHTML = Math.round(feelsLike);

  let windDiv = document.querySelector("#wind");
  let wind = response.data.wind.speed;
  windDiv.innerHTML = wind;

  let cityNameDiv = document.querySelector("#city-name");
  let cityName = response.data.name;
  cityNameDiv.innerHTML = cityName;

  let weatherIconDiv = document.querySelector("#weather-icon");
  let weatherDescription = response.data.weather[0].description;
  weatherIconDiv.setAttribute(
    "src",
    `./images/${weatherIcons[response.data.weather[0].main]}`
  );
  weatherIconDiv.setAttribute("alt", weatherDescription);

  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlForecast).then(displayForecast);
}

function searchMyLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  getCurrentWeather(lat, long);
}

function getCurrentWeather(lat, long) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function clickFahrenheit(event) {
  event.preventDefault();
  let currentDegree = document.querySelector("#current-degree");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  currentDegree.innerHTML = `${Math.round(fahrenheitTemp)} `;
  fahrenheit.classList.add("active");
  celsius.classList.remove("active");
}

function clickCelsius(event) {
  event.preventDefault();
  let currentDegree = document.querySelector("#current-degree");
  currentDegree.innerHTML = `${celsiusTemp} `;
  fahrenheit.classList.remove("active");
  celsius.classList.add("active");
}

let dateEl = document.getElementById("current-time");
dateEl.innerHTML = formatDate(new Date());

let myLoc = document.getElementById("use-my-loction");
myLoc.addEventListener("click", searchMyLocation);

let nameCity = document.querySelector("#search-city");
nameCity.addEventListener("keydown", searchCityEnter);

let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", searchCity);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", clickFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", clickCelsius);

searchCity();

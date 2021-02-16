let apiKey = "5818bec111a0fe8b9841f56c8bff44c7";
let celsiusTemp = null;
let forecast = null;
let weatherIcons = {
  "clear sky": "Sunny.gif",
  "few clouds": "PartlyCloudy.gif",
  "scattered clouds": "Cloudy.gif",
  "broken clouds": "MostlyCloudy.gif",
  "shower rain": "ShowersDrizzle.gif",
  rain: "Rain.gif",
  thunderstorm: "Thunderstorms.gif",
  snow: "Snow.gif",
  mist: "FogFrostHaze.gif",
  "light rain": "Rain.gif",
};

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

  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlForecast).then(displayForecast);
}

function searchCityEnter(event) {
  if (event.keyCode === 13) {
    searchCity();
  }
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#weather-forcast-container");
  forecastElement.innerHTML = null;
  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
      <div class="col-2">
        <strong>${forecast.dt}</strong>
        <img
          class="weather-icon-first"
          src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png"
          alt=""
        />
        <div class="weather-forcast"><strong>${Math.round(
          forecast.main.temp
        )}</strong></div>
      </div>
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
  sunsetDiv.innerHTML = sunset;

  let sunriseDiv = document.querySelector("#sunrise");
  let sunrise = response.data.sys.sunrise;
  sunriseDiv.innerHTML = sunrise;

  let humidityDiv = document.querySelector("#humidity");
  let humidity = response.data.main.humidity;
  humidityDiv.innerHTML = humidity;

  let feelsLikeDiv = document.querySelector("#feels-like");
  let feelsLike = response.data.main.feels_like;
  feelsLikeDiv.innerHTML = feelsLike;

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
    `./images/${weatherIcons[response.data.weather[0].description]}`
  );
  weatherIconDiv.setAttribute("alt", weatherDescription);
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

searchMyLocation();

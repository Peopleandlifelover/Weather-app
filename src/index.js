function getHours() {
  let now = new Date();
  let h4 = document.querySelector("#date");
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];
  h4.innerHTML = `${day}, ${hours}:${minutes}`;
}
getHours();
// Challenge 2
function searchCity(event) {
  event.preventDefault();
  let h3 = document.querySelector("#city-name");
  let search = document.querySelector("#city-input");
  h3.innerHTML = `${search.value}`;
  requestCity(search.value);
}
function requestCity(city) {
  let apiKey = "bfb0bd4a4bf3d093c71d0bfcd8801db1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}
let changeCity = document.querySelector("#city-form");
changeCity.addEventListener("submit", searchCity);
function showTemperature(response) {
  console.log(response.data.main.temp);
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}°C`;
}

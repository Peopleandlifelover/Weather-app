function frequent(number) {
  var count = 0;
  var sortedNumber = number.sort();
  var start = number[0],
    item;
  for (var i = 0; i < sortedNumber.length; i++) {
    if (start === sortedNumber[i] || sortedNumber[i] === sortedNumber[i + 1]) {
      item = sortedNumber[i];
    }
  }
  return item;
}

function showTime(datetime) {
  let now = new Date(datetime);
  let minute = now.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let hour = now.getHours();
  let amPm = "AM";
  if (hour > 12) {
    amPm = "PM";
  }
  convertHour();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
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
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  document.querySelector("#clock").innerHTML = `${hour}:${minute}`;
  document.querySelector("#day").innerHTML = day;
  document.querySelector("#date").innerHTML = `${date} ${month} ${year}`;
  document.querySelector("#amPm").innerHTML = amPm;

  function convertHour() {
    if (hour <= 9) {
      hour = `0${hour}`;
    } else if (hour > 9 && hour <= 12) {
      return hour;
    } else if (hour > 12 && hour <= 21) {
      hour = hour - 12;
      hour = `0${hour}`;
    } else {
      hour = hour - 12;
    }
  }
}

let celsius = null;
let celsiusFeelsLike = null;
let fahrenheit = null;
let fahrenheitFeelsLike = null;
let unit = null;


function showTemperature(response) {
  let city = response.data.name;
  let country = response.data.sys.country;
  let temp = response.data.main.temp;
  let description = response.data.weather[0].description;
  let cloudiness = Math.round(response.data.clouds.all);
  let wind = Math.round(response.data.wind.speed);
  let humidity = Math.round(response.data.main.humidity);
  let feelsLike = response.data.main.feels_like;
  let icon = document.querySelector("#icon");
  showTime(new Date(response.data.dt * 1000));

  celsius = temp;
  celsiusFeelsLike = feelsLike;
  fahrenheit = temp;
  fahrenheitFeelsLike = feelsLike;

  document.querySelector("#temperature").innerHTML = Math.round(temp);
  document.querySelector("#city").innerHTML = `${city}, ${country}`;
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#cloudiness").innerHTML = cloudiness;
  document.querySelector("#wind").innerHTML = wind;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#feels-like").innerHTML = Math.round(feelsLike);
  document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#icon").setAttribute("alt", description);
}


function getForecast(forecast) {
  let array = forecast.data.list;


  let tempMax5days = [];
  let tempMaxDay = [];
  let tempMax = [];

  for (let i = 0; i < array.length; i++) {
    tempMax.push(array[i].main.temp_max);
  }

  for (let j = 0; j < 5; j++) {
    
    tempMaxDay[j] = tempMax.splice(8);
    tempMax5days.push(Math.round(Math.max(...tempMax)));
    tempMax = tempMaxDay[j];
  }
  
  let tempMin5days = [];
  let tempMinDay = [];
  let tempMin = [];

  for (let i = 0; i < array.length; i++) {
    tempMin.push(array[i].main.temp_min);
  }

  for (let j = 0; j < 5; j++) {
    
    tempMinDay[j] = tempMin.splice(8);
    tempMin5days.push(Math.round(Math.min(...tempMin)));
    tempMin = tempMinDay[j];
  }

  let time5days = [];
  let timeEveryDay = [];
  let timeEvery3hour = [];

  for (let k = 0; k < array.length; k++) {
    timeEvery3hour.push(array[k].dt);
  }
  

  for (let l = 0; l < 5; l++) {
    timeEveryDay[l] = timeEvery3hour.splice(8);
    time5days.push(Math.max(...timeEvery3hour));
    timeEvery3hour = timeEveryDay[l];
  }


  let newTime5days = [];
  for (let m = 0; m < 5; m++) {
    newTime5days.push(formatDay(time5days[m] * 1000));
  }
 
  let icon5days = [];
  let iconsPerDay = [];
  let icons = [];

  for (let i = 0; i < array.length; i++) {
    icons.push(array[i].weather[0].icon);
  }
 

  for (let j = 0; j < 5; j++) {
    iconsPerDay[j] = icons.splice(8);
    icon5days.push(frequent(icons));
    icons = iconsPerDay[j];
  }
 
  let forcastElement = document.querySelector("#forecast");
  forcastElement.innerHTML = null;

  for (let i = 0; i < 5; i++) {
    forcastElement.innerHTML += `
    <div class="col">
      <h3>${newTime5days[i]}</h3>
      <img
    class="forecast"
    src="https://openweathermap.org/img/wn/${icon5days[i]}@2x.png"
    alt=""
  />
      <span class="prediction"><strong>${tempMax5days[i]}°</strong>/${tempMin5days[i]}°</span>
    </div>
  `;
  }

  function formatDay(timestamp) {
    let now = new Date(timestamp);

    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[now.getDay()];

    return day;
  }
}

function searchCity(city) {
  if (celsiusLink.classList.value === "active") {
    unit = "metric";
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
  } else {
    unit = "imperial";
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
  }

  let apiKey = "bfb0bd4a4bf3d093c71d0bfcd8801db1";
  let targetUrl = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${targetUrl}q=${city}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);

  targetUrl = "https://api.openweathermap.org/data/2.5/forecast?";
  apiUrl = `${targetUrl}q=${city}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(getForecast);

}

function showPosition(position) {
  if (celsiusLink.classList.value === "active") {
    unit = "metric";
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
  } else {
    unit = "imperial";
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
  }

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "125089b53f00feddd6fbd602dc6cec7a";
  let targetUrl = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${targetUrl}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);

  targetUrl = "https://api.openweathermap.org/data/2.5/forecast?";
  apiUrl = `${targetUrl}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(getForecast);
}

function searchCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
document
  .querySelector("#currentLocation")
  .addEventListener("click", searchCurrentLocation);

function handleClick(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;

  searchCity(city);
}
document.querySelector("#search-form").addEventListener("submit", handleClick);

function convertToFahrenheit(event) {
  event.preventDefault();
  fahrenheit = (celsius * 9) / 5 + 32;
  fahrenheitFeelsLike = (celsiusFeelsLike * 9) / 5 + 32;
  document.querySelector("#temperature").innerHTML = Math.round(fahrenheit);
  document.querySelector("#feels-like").innerHTML = Math.round(
    fahrenheitFeelsLike
  );
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}
let fahrenheitLink = document.querySelector("#toFahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  celsius = ((fahrenheit - 32) * 5) / 9;
  celsiusFeelsLike = ((fahrenheitFeelsLike - 32) * 5) / 9;
  document.querySelector("#temperature").innerHTML = Math.round(celsius);
  document.querySelector("#feels-like").innerHTML = Math.round(
    celsiusFeelsLike
  );
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}
let celsiusLink = document.querySelector("#toCelsius");
celsiusLink.addEventListener("click", convertToCelsius);



function searchCities(event) {
  event.preventDefault();
  let targetCity = event.target.innerHTML;
  
  searchCity(targetCity);
}
document.querySelector("#prague").addEventListener("click", searchCities);
document.querySelector("#london").addEventListener("click", searchCities);
document.querySelector("#paris").addEventListener("click", searchCities);
document.querySelector("#newyork").addEventListener("click", searchCities);
document.querySelector("#tokyo").addEventListener("click", searchCities);


searchCity("Prague");



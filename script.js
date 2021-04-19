// API Key
const apiKey = "b773ba3167fd9791028d0f0f123759cc";
// Time format
const currDate = moment().format('MMM Do YYYY');
const dateFiveDay = moment().format('MM/DD/YY');
// User input
const citySearch = $("#userInput").val();
let lon;
let lat;
let str = '';
// Function used to create li elements for previous searches
function locRecall() {
  $("#locSearch").click(function () {
    str = $("#userInput").val();
    let caps = str.toUpperCase();

    if (str === '') {
      alert("Please enter a City to Search!");
      return
    } else {
      $(".lastLookUp").append('<li class="mb-2"><button>' + caps + '</button></li>')
      $("#userInput").val('');
    }
  })
}
// Fuction to generate the current weather
function getCurrentWeather() {
  // fetch for current weather
  $("#locSearch").click(function () {
    str = $("#userInput").val();
    let weatherUrl = fetch('https://api.openweathermap.org/data/2.5/weather?q=' + str + '&appid=' + apiKey + '&units=imperial')
      .then(function (response) {
        return (response.json());
      })
      .then(function (response) {
        if (response.message === "city not found") {
          alert("Please enter valid city");
          location.reload();
          location.stop();
        } else {
          let cityName = document.querySelector(".cityName");
          cityName.textContent = "(" + response.name + ") - "
          let cityDate = document.querySelector(".currentDate");
          cityDate.textContent = currDate
          let cityTemp = document.querySelector(".cityTemp");
          cityTemp.textContent = Math.floor(response.main.temp) + " °F"
          let cityHum = document.querySelector(".cityHumidity");
          cityHum.textContent = response.main.humidity + "%"
          let cityWind = document.querySelector(".cityWind");
          cityWind.textContent = response.wind.speed + " MPH"
          lon = response.coord.lon
          lat = response.coord.lat
        }
        // fetch for uvIndex
      })
      .then(function () {
        let uvUrl = fetch('http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial')
          .then(function (response) {
            return (response.json())
          })
          .then(function (uv) {
            let cityUv = document.querySelector(".uvIndex");
            cityUv.textContent = Math.floor(uv.value)
            let a = parseInt(cityUv.textContent)
            // uvIndex color coding 
            if (a < 3) {
              $("span.uvIndex").addClass("lowUv")
              $("span.uvIndex").append(" Low");
            } else if (a >= 3 && a <= 5) {
              $("span.uvIndex").addClass("medUv")
              $("span.uvIndex").append(" Moderate");
            } else if (a === 6 || a === 7) {
              $("span.uvIndex").addClass("highUv")
              $("span.uvIndex").append(" High");
            } else if (a >= 8 && a <= 10) {
              $("span.uvIndex").addClass("vHighUv")
              $("span.uvIndex").append(" Very High");
            } else {
              $("span.uvIndex").addClass("exHighUv")
              $("span.uvIndex").append(" Extreme");
            }
          })
      })
    // 5 day forecast fetch
    let queryUrl = fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + str + '&APPID=' + apiKey + '&units=imperial')
      .then(function (response) {
        return (response.json())
      })
      .then(function (test) {
        if (test.message === "city not found") {
          alert("Please enter valid city")
          // location.reload();
        } else {
          // console.log(typeof test.message);
          $(".fiveForecast").html('');
          for (let i = 0; i != test.list.length; i += 8) {
            // console.log(test.list[i])
            let aDate = test.list[i].dt_txt;
            let bDate = aDate.slice(0, 10)
            let fiveDate = moment(bDate).format('MM/DD/YY');
            let aTemp = test.list[i].main.temp;
            let bTemp = Math.floor(aTemp)
            let aHum = test.list[i].main.humidity
            let aIcon = test.list[i].weather[0].icon
            let bIcon = 'https://openweathermap.org/img/w/' + aIcon + '.png'
            $(".fiveForecast").append('<div class="card col m-2 fiveDay"><div class="card-body"><h5 class="card-title">' + fiveDate + '</h5><img src=' + bIcon + '><p class="card-text">Temperature: ' + bTemp + '°F</p><p class="card-text">Humidity: ' + aHum + '%</p></div></div>')
          }
        }
      })
  });
};
getCurrentWeather();
locRecall();

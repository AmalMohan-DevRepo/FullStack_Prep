/**
 * Scripts for Weather App
 * Author : Amal Mohan M
 * API's Used : FreeGeoAPI, OpenWeatherMap API
 * TP Libraries: Chart.js
 * Feature: Show current temp with forecast for the day + 4-5 day forecast depending on the data returned by the API
 * 
 * Feature to implement in next release : 
 * - temp scale toggler. I have not done it. It is easy to, do but this release will not have than functionality
 * -loader/spinner while api call is fetching data
 * - dynamic background colour change on primary display box based on day and night
 **/



//when the page is loaded get the user loaction based on their IP and load that location's weather data
//I'm making use of the freegeoipapi to get this information. Otherwise the page will be blank on load
//https://freegeoip.app/
// call the geoip service only once onload 
window.onload = function GetUserLocDetails() {

    //onload identify the user screen width and insert the canvas element. This is as part of making canvas responsible
    //otherwise initially the chart will be blank. 

    var canvas = document.getElementById('nav-today');

    if (window.screen.width > 915) {

        canvas.innerHTML = `<canvas id="chart-card" height="10%" width="75%"></canvas>`
    }
    else {
        canvas.innerHTML = `<canvas id="chart-card"></canvas>`

    }

    //geoip fetch
    const geoIpURL = 'https://api.freegeoip.app/json/?apikey=1ddd05d0-8be6-11ec-b78b-013ed6b57f38';

    fetch(geoIpURL)
        .then(response => response.json())
        .then(data => {

            GetWeatherDetails(data.city); //pass just the city name, we dont want any other info

        })
        .catch((e) => console.log(e.message));
}


const GetWeatherDetails = (city) => {
    //current weather fetch
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d03f2140abec34e3c563e65202763a46`

    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            //once we get the data, I have a lot of work to do
            // i'll pass this to a main function we can decide afterwards what to do with the data
            ProcessCurrentData(data);

        })
        .catch((e) => console.log(e.message))

    //i have added forecast details to the ui current fetch does not include this data
    //call the forecast api let us load things async

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=d03f2140abec34e3c563e65202763a46`
    fetch(forecastURL)
        .then(response => response.json())
        .then(forecastData => {
            ProcessForecastData(forecastData);
        })
        .catch((e) => console.log(e.message))


}


const iconDescBox = document.getElementById('icon-desc-box');
const mainTempDisp = document.getElementById('main-temp-disp');
const cityTmInfo = document.getElementById('city-time-info-box');
const sunriseTm = document.getElementById('sunrise-box');
const sunsetTm = document.getElementById('sunset-box');
const weatherInfo = document.getElementById('weather-info');

var localTime;
const ProcessCurrentData = (data) => {
    //today's weather data processor
    //get the time zone , we need to find the searched location's local time. Otherwise date/time will be based on user timezone
    const timeZone = data.timezone;
    const sysDt = new Date();
    const sysDtUnix = Math.floor(sysDt.getTime() / 1000);
    localTime = FindDateTime(sysDtUnix, timeZone);

    const currentDay = localTime.toLocaleDateString('en-us', { weekday: 'long' });
    const currentTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const cityCountry = `${data.name}, ${data.sys.country}`;

    const { description: weatherDesc, main: watherMainDesc, icon: weatherIcon } = data.weather[0];

    //temp from api is in kelvin convert it to celsius
    const currentTemp = tempToC(data.main.temp);

    //we now have enough data to populate the main part of the page.
    //inject the DOM

    const iconDescInnerHTML = `
    <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="" class="d-inline-block align-text-top" />
    <span class="text-muted">${watherMainDesc}</span>`

    const cityTmInfoInnerHTML = `
    <span class="display-6">${cityCountry}</span> <br />
    <span class="text-muted display-6" style="font-size: x-large">${currentDay}, ${currentTime}</span> <br />
    <span class="text-muted display-6" style="font-size: x-large">${watherMainDesc}</span>`


    iconDescBox.innerHTML = iconDescInnerHTML;
    mainTempDisp.innerHTML = `${currentTemp}&deg;`;
    cityTmInfo.innerHTML = cityTmInfoInnerHTML;

    //sunrise / sunset time display box

    //i need to convert the unix time returned from the weather API
    //use the time zone  - otherwise if the user search for a different location time will still be in our local timezone
    const sunrise = data.sys.sunrise;
    const sunriseTmData = FindDateTime(sunrise, timeZone);

    const sunset = data.sys.sunset;
    const sunsetTmData = FindDateTime(sunset, timeZone);

    //got the required time load this into htl
    sunriseTm.innerHTML = sunriseTmData.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    sunsetTm.innerHTML = sunsetTmData.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });


    //Today's highlight

    const { humidity, pressure, temp_max, temp_min } = data.main;
    const windSpeed = data.wind.speed;
    const clouds = data.clouds.all;

    //it is easier to load this info as a DOM block rather than individual
    const weatherInfoInnerHTML = `
    <div class="col-6 fs-6">
    <i class="bi bi-thermometer-low"></i> <span id="temp-min">${tempToC(temp_min)}&deg;</span>
    <br />
    <i class="bi bi-thermometer-high"></i> <span id="temp-max">${tempToC(temp_max)}&deg;</span>
    <br />
    <i class="bi bi-wind"></i> <span id="wind-speed">${windSpeed} m/s</span> <br />
  </div>
  <div class="col-6 fs-6">
    <i class="bi bi-droplet"></i> <span id="humidity">${humidity}%</span>
    <br />
    <i class="bi bi-cloud-arrow-down"></i> <span id ="pressure">${pressure / 10} kpa</span>
    <br />
    <i class="bi bi-clouds"></i> <span id ="clouds">${clouds}</span>
  </div>
    `;

    weatherInfo.innerHTML = weatherInfoInnerHTML;

    // primary box is done chart is prepared with the data from forecast API 
    //so it is ok to end this - return
    return true;
}


//Forecast data processor
//currentTempArr should be global - otherwise chart will fail on responsive check
var currentTempArr = [];

const ProcessForecastData = (forecastData) => {

    //I'll first prepare the data for chart
    //chart just needs the temp 

    //I need to clear the temp array every time on search
    currentTempArr = [];

    //This sucker forecast API returns a hell lot of data
    //I need to find the temp forecast for just today from it + the one for 24:00 which will be the next day 
    //so today's objects + next day's first object once we get that we can break out of the filter. 
    //gotNext is helping me do that

    var gotNext = false;

    const filteredCurrentForecast = forecastData.list.filter(object => {

        const objDate = new Date(object.dt_txt);

        if (objDate.getDate() <= localTime.getDate()) {
            return true;
        } else if (!gotNext) {
            gotNext = true;
            return true;
        }

    });

    // now i have todays forecast inside filteredCurrentForecast array. get just the temp from each object conver to deg C
    //push to the temp arr for chart

    filteredCurrentForecast.forEach(ob => {

        currentTempArr.push(tempToC(ob.main.temp));
    })

    //we have 8 points in the chart from 00:00 -24:00 but API does not provide the full data for today
    //so our array might contain only fewer data and the chart will fail - prefix nulls to fix this issue
    while (currentTempArr.length < 9) {

        currentTempArr.unshift(null);
    }

    //before calling the chart processor - see if the canvas has any data, if so destroy it. destory() is a chart.js method
    if (chartData) {
        chartData.destroy();
    }

    ProcessChart(currentTempArr);

    //we are done with the all the elemnts of the first page
    //lets do things to populate the week tab 
    //4-5 day forecast based on data from API

    const forecastBox = document.getElementById('5day-forecast-data');

    //api data will have some of today's forecast too. We dont want that. so only get data from next day onwards
    const filteredFutureForecast = forecastData.list.filter(object => new Date(object.dt_txt).getDate() > localTime.getDate());


    const forecastOnTime = [];

    // My logic of forecast box is like, we need to find the nearest time from the API to the current user's time 
    //eg: api retuns 3-hour interval data(00:00,03:00,06:00...21:00)
    //so get the users current local time and see what is the nearest forecast data we can get. 
    // if localtime is 16:00 which is in between 15:00 and 18:00 - i will use data for 18:00

    const d = localTime;
    const localTime1 = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const nerestTimeForForecast = FindNearestTime(localTime1);

    filteredFutureForecast.forEach(obj => {

        if (new Date(obj.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) == nerestTimeForForecast) {

            forecastOnTime.push(obj);
            d.setDate(d.getDate() + 1);
        }

    });

    //we have the 5/4 day data now inject it
    var forecastDataInnerHTML = '';

    forecastOnTime.forEach(ob => {

        const forecastDay = new Date(ob.dt_txt).toLocaleDateString('en-us', { weekday: 'long' });

        const forecastTemp = (ob.main.temp - 273.15).toFixed(0);

        const forecastWeatherDesc = ob.weather[0].main;


        const forecastWeatherIcon = ob.weather[0].icon;

        const forecastWind = ob.wind.speed;

        const forecastHumidity = ob.main.humidity;


        const forecastDOM =
            `
    <div class="col">
    <div class="card h-100">
      <div class="card-body p-2">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="card-title" style="font-size: small">
            ${forecastDay} <br />
            <span class="text-muted" style="font-size: x-small">${forecastWeatherDesc}</span>
          </h6>
          <img src="http://openweathermap.org/img/wn/${forecastWeatherIcon}.png" alt="" class="d-inline-block align-text-top"/>
        </div>
        <div class="card-text d-flex justify-content-between align-items-center" >
          <div style="font-size: small">
            <div><i class="bi bi-wind"></i> ${forecastWind} m/s</div>
            <div><i class="bi bi-droplet"></i> ${forecastHumidity}%</div>
          </div>
          <div class="" style="font-size: x-large"> ${forecastTemp}&deg;</div>
        </div>
      </div>
    </div>
  </div>
    `
        forecastDataInnerHTML = forecastDataInnerHTML.concat(forecastDOM);


    })


    forecastBox.innerHTML = forecastDataInnerHTML;

    //everything should be loaded by now
    //we are done :) 
    return true;
}


// this is the chart code. chart.js library is handling the chart making
//https://www.chartjs.org/
var chartData;
function ProcessChart(data) {
    const canvas = document.getElementById('chart-card');
    const context = canvas.getContext('2d');

    chartData = new Chart(context, {
        type: 'line',
        data: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
            datasets: [
                {
                    label: 'Temperature',
                    data: data,
                    pointStyle: 'circle',
                    borderColor: 'rgb(187, 216, 242)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.1

                }

            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }

    });

}
// chart code end


/**
 * Functions
 * 
 */

//i should have used a switch here ? no, ifs are good 
const FindNearestTime = (t) => {

    if (t >= '00:00' && t < '03:00')
        return '03:00'

    if (t >= '03:00' && t < '06:00')
        return '06:00'

    if (t >= '06:00' && t < '09:00')
        return '09:00'

    if (t >= '09:00' && t < '12:00')
        return '12:00'

    if (t >= '12:00' && t < '15:00')
        return '15:00'

    if (t >= '15:00' && t < '18:00')
        return '18:00'

    if (t >= '18:00' && t < '21:00')
        return '21:00'

    if (t >= '21:00' && t < '24:00')
        return '06:00'
}


const tempToC = (temp) => (temp - 273.15).toFixed(1);


const FindDateTime = (unixDt, timeZone) => {
    const localDt = new Date(unixDt * 1000);
    const localOffset = localDt.getTimezoneOffset();
    localDt.setMinutes(localDt.getMinutes() + localOffset);

    const countryOffset = timeZone / 60;
    localDt.setMinutes(localDt.getMinutes() + countryOffset);

    return localDt;
}



//responsive chart handler
function mediaFunction(x) {
    var canvas = document.getElementById('nav-today');
    if (x.matches) {

        canvas.innerHTML = `<canvas id="chart-card" height="10%" width="75%"></canvas>`
        ProcessChart(currentTempArr);
    }
    else {
        canvas.innerHTML = `<canvas id="chart-card"></canvas>`
        ProcessChart(currentTempArr);
    }
}

var x = window.matchMedia("(min-width:915px)");
mediaFunction(x)
x.addEventListener('change', mediaFunction);


//button click event handler
const buttonSearch = document.getElementById('button-search');

buttonSearch.addEventListener('click', () => {

    const inputBox = document.getElementById('search-text');
    const inputCity = inputBox.value;

    GetWeatherDetails(inputCity);

})

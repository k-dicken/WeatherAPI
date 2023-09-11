const baseurl = `https://api.weatherapi.com/v1/forecast.json?key=`;
const apikey = `23a7ada5e8f94a638a2204743232808`;
let activeLocation = '';
let activeLocationData = '';
let activeDayID = 1;
let activeForecastNum = 7;

function initListeners() {    
    $("#submit-search").on("click", (e) => {
        e.preventDefault();
        let input = $("#search-field").val();

        if(input != "") {
            if($.isNumeric(input) && input.length != 5) {
                $('#search-error-message').html("Zip code must be 5 characters long.")
            } else {
                activeLocation = input
                $('#search-error-message').html("");
                collectData(input, activeForecastNum);
                $("#day-forecast-num").html(activeForecastNum);
                $("#display").removeClass("hidden");
                $("#display").addClass("show");
            }
        } else {
            $('#search-error-message').html("Please enter a zip code or city.")
        }
    })
    $("#submit-day").on("click", (e) => {
        e.preventDefault();
        let input = $("#input-day-num").val();

        if(input != "") {
            console.log(input);
            activeForecastNum = input;
            $("#day-forecast-num").html(activeForecastNum);
            collectData(activeLocation, activeForecastNum);
        }
    })
}

function convertDate(date_epoch) {
    //convert date_epoch to array of date information
    let d = new Date(0);
    d.setUTCSeconds(date_epoch);
    d = String(d);
    let dates = d.split(" ");
    
    console.log(dates);
    return dates;
}

function addDays() {
    $("#day-forecast-num").val(activeForecastNum);

    //for each day, add day to days variable that is used to replace the html of #days. each day must be clickable with its id to trigger setActiveDate
    let days = ``;

    activeLocationData.forecast.forecastday.forEach((day, index) => {
        days = days + `<div id=${index} class="day" onClick="setActiveDate(${index})">
        <p class="date">${convertDate(day.date_epoch)[0]} ${convertDate(day.date_epoch)[2]}</p>
        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
        <p class="chance">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#777777}</style><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg> ${day.day.daily_chance_of_rain}%</p>
        <p class="temp-high">${Math.trunc(day.day.maxtemp_f)}° F</p>
        <p class="temp-low">${Math.trunc(day.day.mintemp_f)}° F</p>
        <p class="wind">${day.day.maxwind_mph} MPH</p>
      </div>`
    });

    $("#days").html(days);

    setActiveDate(activeDayID);
}

function setActiveDate(date) {
    let dateData = activeLocationData.forecast.forecastday[date];

    //set color of selected day
    $(`#${activeDayID}`).css("background-color", "#f7f7f7");
    activeDayID = date;
    $(`#${activeDayID}`).css("background-color", "#fff");

    // insert top data 
    $("#display-location").html(`${activeLocationData.location.name}, ${activeLocationData.location.region} <br>  ${activeLocationData.location.country}`)
    
    $("#display-date").html(`${convertDate(dateData.date_epoch)[0]}, ${convertDate(dateData.date_epoch)[1]} ${convertDate(dateData.date_epoch)[2]}`)

    $("#display-icon").html(`<img src="${dateData.day.condition.icon}" alt="${dateData.day.condition.text}">
    <p>${dateData.day.condition.text}</p>`)

    $("#display-temp-main").html(`${Math.trunc(dateData.day.avgtemp_f)}° F`)
    $("#display-temp-high").html(`${Math.trunc(dateData.day.maxtemp_f)}° F`)
    $("#display-temp-low").html(`${Math.trunc(dateData.day.mintemp_f)}° F`)

    //insert below data
    $("#sunrise").html(dateData.astro.sunrise);
    $("#sunset").html(dateData.astro.sunset);
    $("#moonrise").html(dateData.astro.moonrise);
    $("#moonset").html(dateData.astro.moonset);
    $("#moonphase").html(dateData.astro.moon_phase);

    let hours = '';
    dateData.hour.forEach((hour, index) => {

        let time = hour.time.split(" ");

        hours = hours +     `<div class="hour">
        <p class="time">${time[1]}</p>
        <div class="icon"> <img src="${hour.condition.icon}" alt="${hour.condition.text}"></div>
        <p class="chance"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#777777}</style><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg> ${hour.chance_of_rain} %</p>
        <div class="feel-temp">${hour.temp_f}° F</div>
        <div class="index">
          <div class="windchill"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#000000}</style><path d="M224 0c17.7 0 32 14.3 32 32V62.1l15-15c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-49 49v70.3l61.4-35.8 17.7-66.1c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4l-5.2 19.3 23.6-13.8c15.3-8.9 34.9-3.7 43.8 11.5s3.8 34.9-11.5 43.8l-25.3 14.8 21.7 5.8c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-67.7-18.1L287.5 256l60.9 35.5 67.7-18.1c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4l-21.7 5.8 25.3 14.8c15.3 8.9 20.4 28.5 11.5 43.8s-28.5 20.4-43.8 11.5l-23.6-13.8 5.2 19.3c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-17.7-66.1L256 311.7v70.3l49 49c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-15-15V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V449.9l-15 15c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l49-49V311.7l-61.4 35.8-17.7 66.1c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4l5.2-19.3L48.1 395.6c-15.3 8.9-34.9 3.7-43.8-11.5s-3.7-34.9 11.5-43.8l25.3-14.8-21.7-5.8c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l67.7 18.1L160.5 256 99.6 220.5 31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4l21.7-5.8L15.9 171.6C.6 162.7-4.5 143.1 4.4 127.9s28.5-20.4 43.8-11.5l23.6 13.8-5.2-19.3c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l17.7 66.1L192 200.3V129.9L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l15 15V32c0-17.7 14.3-32 32-32z"/></svg> ${hour.windchill_f}° F</div>
        </div>
        <div class="wind">${hour.wind_mph} MPH<br><span>${hour.wind_dir}</span></div>
      </div>`;
    });

    $("#hours").html(hours);
}

function collectData(input, daysNum) {
    console.log(activeForecastNum)
    let url = baseurl + apikey + '&q=' + input + '&days=' + daysNum + '&aqi=no&alerts=no';
    console.log(url)
    $.getJSON(url, (data) => {
        activeLocationData = data;
        console.log(data);

        addDays(daysNum);
    }).fail(function(e) {
        console.log(e);
        $('#search-error-message').html(`${e.responseJSON.error.message}<br>(Error code ${e.responseJSON.error.code})`);
    })
}
 
$(document).ready(function () {
    initListeners();
});
const baseurl = `https://api.weatherapi.com/v1/forecast.json?key=`;
const apikey = `23a7ada5e8f94a638a2204743232808`;
let activeLocationData = '';
let activeDayID = 1;
let activeForecastNum = 5;

function initListeners() {    
    $("#submit-search").on("click", (e) => {
        e.preventDefault();
        let input = $("#search-field").val();

        if(input != "") {
            if($.isNumeric(input) && input.length != 5) {
                $('#search-error-message').html("Zip code must be 5 characters long.")
            } else {
                collectData(input, activeForecastNum);
                $("#display").removeClass("hidden");
                $("#display").addClass("show");
            }
        } else {
            $('#search-error-message').html("Please enter a zip code or city.")
        }
    })
}

function convertDate(date_epoch) {
    let d = new Date(0);
    d.setUTCSeconds(date_epoch);
    d = String(d);
    let dates = d.split(" ");
    
    return dates;
}

function addDays() {
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
      </div>`
    });

    $("#days").html(days);

    setActiveDate(activeDayID);
}

function setActiveDate(date) {
    let dateData = activeLocationData.forecast.forecastday[date];
    $(`#${activeDayID}`).css("background-color", "#f7f7f7");
    activeDayID = date;
    $(`#${activeDayID}`).css("background-color", "#fff");

    $("#display-location").html(`${activeLocationData.location.name}, ${activeLocationData.location.region} <br>  ${activeLocationData.location.country}`)
    
    $("#display-date").html(`${convertDate(dateData.date_epoch)[0]}, ${convertDate(dateData.date_epoch)[1]} ${convertDate(dateData.date_epoch)[2]}`)

    $("#display-icon").html(`<img src="${dateData.day.condition.icon}" alt="${dateData.day.condition.text}">
    <p>${dateData.day.condition.text}</p>`)

    $("#display-temp-main").html(`${Math.trunc(dateData.day.avgtemp_f)}° F`)
    $("#display-temp-high").html(`${Math.trunc(dateData.day.maxtemp_f)}° F`)
    $("#display-temp-low").html(`${Math.trunc(dateData.day.mintemp_f)}° F`)
}

function collectData(input, daysNum) {
    let url = baseurl + apikey + '&q=' + input + '&days=' + daysNum + '&aqi=no&alerts=no';

    $.getJSON(url, (data) => {
        activeLocationData = data;

        addDays(daysNum);
    }).fail(function(e) {
    })
}
 
$(document).ready(function () {
    initListeners();
});
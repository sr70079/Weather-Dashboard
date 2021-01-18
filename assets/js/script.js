var APIKey = "a789e74543ab2eb315de8d5bcab5a0b9";
var currentTime = new Date();
var citiesSearched = [];


var createCity = function(response, cityName, weatherIcon) {
    var div = $("<div>");
    var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + ".png"
    var icon = $("<img>").attr("src", iconUrl);
    var cityEl = $("<h3>").text(cityName + "(" + currentTime.toLocaleDateString("en-US") + ")")
    cityEl.append(icon);
    var windP = $("<p>").text("Wind Speed: " + response.current.wind_speed);
    var humidityP = $("<p>").text("Humidity: " + response.current.humidity);
    var uvP = $("<p>").text("UV Index: ");
    var uvSpan = $("<span>").text(response.current.uvi);
    uvP.append(uvSpan);
    if (response.current.uvi >= 0 && response.current.uvi <= 2) 
        uvSpan.addClass("green");
    if (response.current.uvi >= 3 && response.current.uvi <= 7) 
        uvSpan.addClass("yellow");
    if (response.current.uvi >= 8) 
        uvSpan.addClass("red");
    
    var tempF = (response.current.temp - 273.15) * 1.80 + 32;
    var tempP = $("<p>").text("Temperature (F) " + tempF.toFixed(2));

    div.append(cityEl, windP, humidityP, tempP, uvP)

    $("#main").html(div);

    createForecast(response)
};

var createForecast = function(response) {

    $("#5-day-forecast").empty();

    for (i = 0; i < 5; i++) {
        
        var iconUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png"
    
        var div = $("<div class='col-sm-2 forecast-day'>");
        var date = $("<p>").text(currentTime.addDays(i+1).toLocaleDateString("en-US"));
        var icon = $("<img>").attr("src", iconUrl);
        var tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
        var temp = $("<p>").text("Temp: " + tempF.toFixed(2));
        var hum = $("<p>").text("Humidity: " + response.daily[i].humidity);        

        div.append(date, icon, temp, hum);

        $("#5-day-forecast").append(div);

    }       
    
};

var searchCity = function(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        var oneCallQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + response.coord.lon + "&lat=" + response.coord.lat + "&appid=" + APIKey;

        $.ajax({
            url: oneCallQueryUrl,
            method: "GET"
        })

        .then(function(oneCallResponse) {      
            createCity(oneCallResponse, response.name, response.weather[0].icon);
            citiesSearched.unshift(response.name)

            localStorage.setItem("citiesSearched", JSON.stringify(citiesSearched)); 
        });
    });
};

$("#search").on("click", function() {
    searchCity($("#city-search").val().trim());
});

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var callCity = function () {
    citiesSearched = JSON.parse(localStorage.getItem("citiesSearched")) ?? [];
    if (citiesSearched.length>0) {
        searchCity(citiesSearched[0]);
    };
};

var displayCities = function() {
    var div = $("<div>");    
    for (i = 0; i < citiesSearched.length; i++) {
        var newSearch = $('<div class="new-search" onclick="searchCity(\'' + citiesSearched[i] + '\')">');
        newSearch.text(citiesSearched[i]); 
        div.append(newSearch);
    };       

    $("#city-storage").append(div);

};   


$(document).ready(function() {
    
    callCity();

    displayCities();
});
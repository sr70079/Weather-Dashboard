$(document).ready(function() {

    // This is our API key
    var APIKey = "a789e74543ab2eb315de8d5bcab5a0b9";
    var lon = 0.0;
    var lat = 0.0;

    var createCity = function(response, cityName) {
        var div = $("<div>");
        var cityEl = $("<h3>").text(cityName)
        var windP = $("<p>").text("Wind Speed: " + response.current.wind_speed);
        var humidityP = $("<p>").text("Humidity: " + response.current.humidity);
        var uvP = $("<p>").text("UV Index: " + response.current.uvi)
        
        var tempF = (response.current.temp - 273.15) * 1.80 + 32;
        var tempP = $("<p>").text("Temperature (F) " + tempF.toFixed(2));

        div.append(cityEl, windP, humidityP, tempP, uvP)

        $("#main").html(div);

        createForecast(response)
    };

    var createForecast = function(response) {

        for (i = 0; i < 5; i++) {
            
        var iconUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png"
       
        var div = $("<div>");
        var date = $("<p>").text()
        var icon = $("<img>").attr("src", iconUrl);
        var tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
        var temp = $("<p>").text(tempF.toFixed(2));
        var hum = $("<p>").text(response.daily[i].humidity);        

        div.append(date, icon, temp, hum);

        $("#5-day-forecast").html(div);

        }       
        
    };

    var searchCity = function(city) {
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {
            // Log the resulting object
            console.log(response);

            

            var oneCallQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + response.coord.lon + "&lat=" + response.coord.lat + "&appid=" + APIKey;

            // Here we run our AJAX call to the OpenWeatherMap API
            $.ajax({
                url: oneCallQueryUrl,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(oneCallResponse) {
                console.log(response.name)
                console.log(oneCallResponse);
                
                createCity(oneCallResponse, response.name);

            });
        });
    };

    $("#search").on("click", function() {
        searchCity($("#city-search").val().trim());
    });
});
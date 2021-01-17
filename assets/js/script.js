$(document).ready(function() {

    // This is our API key
    var APIKey = "a789e74543ab2eb315de8d5bcab5a0b9";
    var lon = 0.0;
    var lat = 0.0;

    var createLi = function(response) {
        var ul = $("<ul>");
        var cityLi = $("<li>").text(response.name)
        var windLi = $("<li>").text("Wind Speed: " + response.wind.speed);
        var humidityLi = $("<li>").text("Humidity: " + response.main.humidity);
        // var uvLi = $("<li>").text("UV Index: " + response.) need to find uv index
        
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var tempLi = $("<li>").text("Temperature (F) " + tempF.toFixed(2));

        ul.append(cityLi, windLi, humidityLi, tempLi)

        $("#main").append(ul);
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

            createLi(response);

            
            // Transfer content to HTML
            // $(".city").html("<h1>" + response.name + " Weather Details</h1>");
            // $(".wind").text("Wind Speed: " + response.wind.speed);
            // $(".humidity").text("Humidity: " + response.main.humidity);
            //$(."uv").text("UV Index: " + response.) need to find uv index
            
            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            // add temp content to html
            // $(".temp").text("Temperature (K) " + response.main.temp);
            // $(".tempF").text("Temperature (F) " + tempF.toFixed(2));

            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + tempF);

            var oneCallQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + response.lon + "&lat=" + response.lat + "&appid=" + APIKey;

            // Here we run our AJAX call to the OpenWeatherMap API
            $.ajax({
                url: oneCallQueryUrl,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(response) {
                console.log(response);
            });
        });
    };

    $("#search").on("click", function() {
        searchCity($("#city-search").val().trim());
    });
});
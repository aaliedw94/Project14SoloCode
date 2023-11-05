const h1 = document.getElementById("start");
let main_coordinates;
const color_msg = document.getElementById("color-change");

/*let h1colorChange = h1.style.color("red");
let h1colorChange2 = h1.style.color("orange");*/

/*h1.addEventListener("mouseover", () => {
    h1.style.color = "blue";
} );*/

/*async function h1Change() {
    
    })
}*/

//map variable to be used throughout the code
let map;
function initMap() {
    //default coordinates for our map
    main_coordinates = {
        lat: 37.422001,
        lng: -121.2590
    };
    //creating our map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: main_coordinates
    });

    let infowindow = new google.maps.InfoWindow();
    Date_Time(); //Displays the current date and time
    map.addListener("click", (e) => {
        alert("You clicked the map at " + JSON.stringify(e.latLng.toJSON(), null, 2));
    }); //Clicking the marker will show you the location
    geocoder = new google.maps.Geocoder();

    //all directions options to be used for the route search functionality
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    //setting the center of the initial map
    map.setCenter({ lat: 34.0522, lng: -118.5671 });

}

//function that will allow users to enter a location and a marker will be placed based on the result
function placeMarker() {
    main_coordinates = {
        lat: 37.422001,
        lng: -121.259004
    };
    
    map.setCenter(main_coordinates);
    let address = document.getElementById("location").value;
    geocoder.geocode({
        'address': address},
        function(results, status) {
            if (status == "OK") {
                map.setCenter(results[0].geometry.location);
                let myMarker = new google.maps.Marker({
                    map,
                    position: results[0].geometry.location,
                    draggable: true
                });
                let my_info = new google.maps.InfoWindow({
                    content: "Welcome to " + address + "!",
                });
                myMarker.addListener("click", () => {
                    my_info.open(map, myMarker)
                }); 
            }
            else {
                alert('Geocode was not successful for the following reason: ' + status)
            }
    });
}

//function to allow users to search for a route based on an origin and destination
function RouteSearch() {
    //gathers the user's entered origin, destination and transportation type selection
    let origin_point = document.getElementById("origin").value;
    let destination = document.getElementById("destination").value;
    let transpo_type = document.getElementById("transpo-type").value;
    
    //gathering the origin point, destination and type of travel
    let request = {
        origin: origin_point,
        destination: destination,
        travelMode: google.maps.TravelMode[transpo_type]        
    };
    //Direction service to gather directions and polyline for the request
    directionsService.route(request, function(response, status){
        if (status == 'OK') {
            
            directionsRenderer.setDirections(response);
            var directionsData = response.routes[0].legs[0];
            if (!directionsData) {
                window.alert('Directions request failed');
                return;
            }
            else {
                document.getElementById('directions-msg').innerHTML += transpo_type + " distance is " + 
                directionsData.distance.text + " (" + directionsData.duration.text + ").";
            }
        }
        else {
            alert("Unexpected error occurred. Please try again.");
        }
    });

}

//This function will gather the current date and time, I plan to use it for when a marker is set
function Date_Time() {
    
    setInterval(function () {
            const getDate = new Date();
            document.getElementById("date").innerHTML = "The date and time are currently " + getDate;
           });
}

//Created a function to reset the map and get rid of the travel time message as well
function resetMap() {
    document.getElementById("directions-msg").innerHTML = "";
    initMap();
    
}

//This function will select a random color for the header to a random and both display the RGB value of the
//new color and delete the message after 5 seconds
const newH1Color = () => {
    //variable to select a random color
    const newColor = Math.floor(Math.random()*16777215).toString(16);
    h1.style.color = "#" + newColor;
    color_msg.innerHTML += "Color of header is now " + h1.style.color + "<br>";
    setTimeout(() => {
        color_msg.textContent = "";}, 5000); //Color change message disappears after 5 seconds
}
//function to ensure the header changes color after 10 seconds
function change10() {
    setInterval(newH1Color, 10000);
}

change10(); //Calling our function to change the color of the header every 10 seconds
(function(exports) {
  "use strict";

  /**Intialize the map**/
  function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var geocoder = new google.maps.Geocoder();
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: {
        lat: 41.85,
        lng: -87.65
      }
    });
    directionsRenderer.setMap(map);
    map.addListener('click', function(e) {
      addToRoute(e, geocoder);
    });
    document.getElementById("submit").addEventListener("click", function() {
      newRoute();
    });
  }

  /*Add the new Route to the database*/
  function newRoute() {
    var checkboxArray = document.getElementById("waypoints");
    var rid = Math.floor(Math.random() * 1000000)
    console.log(rid)
    var id = 0

    for (var i = 0; i < checkboxArray.length; i++) {
      fetch("/addroute", {method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          location: checkboxArray[i].value,
          stopover: true,
          routeNum: i,
          routeId: rid
      })})
      .then(checkStatus)
      .then(resp => resp.text())
      .then(function(resp) {
        document.getElementById("directions-panel").innerHTML =
          "<b>Route Segment: " + resp + "</b><br>";
      })
      .catch(console.error);
    }
    console.log(document.getElementById("title").value);
    fetch("/addroutedescription", {method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: rid,
        route_title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        tags: document.getElementById("tags").value,
        author: document.getElementById("author").value
    })})
    .then(checkStatus)
    .then(resp => resp.text())
    .then(function(resp) {
      document.getElementById("directions-panel").innerHTML +=
        "<b>Route Segment: " + resp + "</b><br>";
    })
    .catch(console.error);
  }

  /*Compile all clicked locations for a new route*/
  function addToRoute(e, geocoder) {
    if (e.placeId == undefined) {
      id("waypoints").innerHTML += "<option value=\"" +
                                  e.latLng.lat() +
                                  ", " +
                                  e.latLng.lng() +
                                  "\" >" +
                                  e.latLng.lat() +
                                  ", " +
                                  e.latLng.lng() +
                                  "</option>";
    } else {
      geocoder.geocode({
      'latLng': e.latLng
      }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          console.log(results);
          id("waypoints").innerHTML += "<option value=\"" +
                                      results[0].formatted_address +
                                      "\" >" +
                                      results[0].formatted_address +
                                      "</option>";
        }
      }});
    }
  }

  /*Generates a route from api markers*/
  function showRouteFromAPI(directionsService, directionsRenderer, numRoute) {
    fetch("/markers/" + numRoute)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(function(resp) {
        let waypts = [];
        for (let i = 1; i < resp.length - 1; i++) {
          let address = resp[i].address;
          waypts.push({
            location: address,
            stopover: true
          });
        }
        directionsService.route(
          (waypts.length == 0 ? {
            origin: resp[0].address,
            destination: resp[resp.length - 1].address,
            avoidTolls: true,
            provideRouteAlternatives:true,
            travelMode: "WALKING"
          } : {
            origin: resp[0].address,
            destination: resp[resp.length - 1].address,
            waypoints: waypts,
            optimizeWaypoints: true,
            avoidTolls: true,
            provideRouteAlternatives:true,
            travelMode: "WALKING"
          }),
          function(response, status) {
            if (status === "OK") {
              directionsRenderer.setDirections(response);
              var route = response.routes[0];
              var summaryPanel = document.getElementById("directions-panel");
              summaryPanel.innerHTML = ""; // For each route, display summary information.

              for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                summaryPanel.innerHTML +=
                  "<b>Route Segment: " + routeSegment + "</b><br>";
                summaryPanel.innerHTML +=
                  route.legs[i].start_address + " to ";
                summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                summaryPanel.innerHTML +=
                  route.legs[i].distance.text + "<br><br>";
              }
            } else {
              window.alert("Directions request failed due to " + status);
            }
          }
        );
      })
      .catch(console.error);
  }

  function calculateAndDisplayRoute(
    directionsService,
    directionsRenderer
  ) {
    var waypts = [];
    var checkboxArray = document.getElementById("waypoints");

    for (var i = 0; i < checkboxArray.length; i++) {
      if (checkboxArray.options[i].selected) {
        waypts.push({
          location: checkboxArray[i].value,
          stopover: true
        });
      }
    }

    directionsService.route(
      {
        origin: document.getElementById("start").value,
        destination: document.getElementById("end").value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: "WALKING"
      },
      function(response, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          var route = response.routes[0];
          var summaryPanel = document.getElementById("directions-panel");
          summaryPanel.innerHTML = ""; // For each route, display summary information.

          for (var i = 0; i < route.legs.length; i++) {
            var routeSegment = i + 1;
            summaryPanel.innerHTML +=
              "<b>Route Segment: " + routeSegment + "</b><br>";
            summaryPanel.innerHTML +=
              route.legs[i].start_address + " to ";
            summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
            summaryPanel.innerHTML +=
              route.legs[i].distance.text + "<br><br>";
          }
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

  exports.calculateAndDisplayRoute = calculateAndDisplayRoute;
  exports.initMap = initMap;
})((this.window = this.window || {}));

// ------------------------- HELPER FUNCTIONS ------------------------- //
/**
 * Returns the element that has the ID attribute with the specified value.
 * @param {string} idName - element ID.
 * @return {object} DOM object associated with id.
 */
function id(idName) {
  return document.getElementById(idName);
}

/**
 * Helper function to return the response's result text if successful, otherwise
 * returns the rejected Promise result with an error status and corresponding text
 * @param {object} response - response to check for success/error
 * @return {object} - valid response if response was successful, otherwise rejected
 *                    Promise result
 */
function checkStatus(response) {
  if (!response.ok) {
    console.log(response);
    throw Error("Error in request: " + response.statusText);
  }
  return response; // a Response object
}

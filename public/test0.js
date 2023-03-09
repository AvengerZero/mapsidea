(function(exports) {
  "use strict";

  /**Intialize the map**/
  function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: {
        lat: 41.85,
        lng: -87.65
      }
    });
    directionsRenderer.setMap(map);
    document
      .getElementById("submit")
      .addEventListener("click", function() {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
      });
    showRouteFromAPI(directionsService, directionsRenderer, "1");

  }

  /*Generates a route from api markers*/
  function showRouteFromAPI(directionsService, directionsRenderer, numRoute) {
    fetch("/markers/" + numRoute)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(function(resp) {
        let waypts = [];
        for (let i = 1; i < resp.length; i++) {
          let address = resp[i].address;
          waypts.push({
            location: address,
            stopover: true
          });
        }
        directionsService.route(
          {
            origin: resp[0].address,
            destination: resp[resp.length - 1].address,
            waypoints: waypts,
            optimizeWaypoints: true,
            avoidTolls: true,
            provideRouteAlternatives:true,
            travelMode: "WALKING"
          },
          function(response, status) {
            if (status === "OK") {
              directionsRenderer.setDirections(response);
              console.log(response);
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
    throw Error("Error in request: " + response.statusText);
  }
  return response; // a Response object
}

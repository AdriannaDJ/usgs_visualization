// Part 1 - Create the Earthquake Visualization
// Assign URL
let queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Leaflet - create map
let myMap = L.map("map", {
    center: [37.91, -122.06],
    zoom: 5
});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Fetch data
d3.json(queryURL).then(function(data) {
    // Loop thru data
    data.features.forEach(function(feature) {
    // Data markers reflect magnitude of earthquake by radius (higher = larger) and depth of earthquake by color (greater = darker).
    // Assign colors for markers
        let color = "";
        var depth = feature.geometry.coordinates[2]
        if (depth >= 90) {
            color = "darkred";
        } else if (depth >= 70) {
            color = "red";
        } else if (depth >= 50) {
            color = "orange";
        } else if (depth >= 30) {
            color = "yellow";
        } else if (depth >= 10) {
            color = "yellowgreen";
        } else {
            color = "lightgreen";
        }
    // Create circle marker including radius altered by depth (3rd coordinate).
    // https://sentry.io/answers/convert-unix-timestamp-to-date-and-time-in-javascript/
    // Add Popups with additional info on earthquake.
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: color,
            radius: feature.properties.mag * 10000,
            weight: 1
        }).bindPopup(`<h2> Location: ${feature.properties.place} </h2>\
        <hr><h2> Magnitude: ${feature.properties.mag} </h2>\
        <hr><h2> Magnitude Type: ${feature.properties.magType} </h2>\
        <hr><h2> Magnitude Depth: ${feature.geometry.coordinates[2]} </h2>\
        <hr><h2> Date: ${Date(feature.properties.time * 1000)} </h2>`).addTo(myMap);
    })
});



// Create Legend with map data
// https://codepen.io/haakseth/pen/KQbjdO
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Depth:</h4>";
  div.innerHTML += '<i style="background: lightgreen"></i><span>10-10</span><br>';
  div.innerHTML += '<i style="background: yellowgreen"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: yellow"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: orange"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: red"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: darkred"></i><span>90+</span><br>';
  return div;
};

legend.addTo(myMap);




// Part 2 - Gather and Plot More Data
// Import data 

// Plot the tectonic plates dataset on the map in addition to the earthquakes.

// Add other base maps to choose from.

// Put each dataset into separate overlays that can be turned on and off independently.

// Add layer controls to your map.
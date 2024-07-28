// Create the Earthquake Visualization
// Assign URLs
const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
const plateURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

// Leaflet - create map
const myMap = L.map("map", {
    center: [37.91, -122.06],
    zoom: 5
});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Initialize layer groups
const earthquakes = L.layerGroup().addTo(myMap);
const tectonicPlates = L.layerGroup();

// Fetch data for earthquakes
d3.json(earthquakeURL).then(function(earthquakeData) {
    earthquakeData.features.forEach(function(feature) {
        const depth = feature.geometry.coordinates[2];
        let color = "";
        if (depth >= 90) color = "darkred";
        else if (depth >= 70) color = "red";
        else if (depth >= 50) color = "orange";
        else if (depth >= 30) color = "yellow";
        else if (depth >= 10) color = "yellowgreen";
        else color = "lightgreen";

        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: color,
            radius: feature.properties.mag * 10000,
            weight: 1
        }).bindPopup(`<h3> Location: ${feature.properties.place} </h3>
        <hr><h3> Magnitude: ${feature.properties.mag} </h3>
        <hr><h3> Magnitude Type: ${feature.properties.magType} </h3>
        <hr><h3> Depth: ${feature.geometry.coordinates[2]} </h3>
        <hr><h3> Date: ${new Date(feature.properties.time * 1000)} </h3>`)
        .addTo(earthquakes);
    });
});

// Fetch data for tectonic plates
d3.json(plateURL).then(function(plateData) {
    L.geoJSON(plateData, {
        style: {
            color: 'orange',
            weight: 2
        }
    }).addTo(tectonicPlates);
});

// Add layer controls
L.control.layers(null, {
    'Earthquakes': earthquakes,
    'Tectonic Plates': tectonicPlates
}, {
    collapsed: false
}).addTo(myMap);

// Create Legend
const legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "<h4>Earthquake Depth:</h4>";
    div.innerHTML += '<i style="background: lightgreen"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: yellowgreen"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: darkred"></i><span>90+</span><br>';
    return div;
};

legend.addTo(myMap);
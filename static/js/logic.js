//Basic States Map
var mapboxAccessToken = API_KEY;
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);


// // import my geojason data 
(async function(){
    const data = await d3.json("data/data.geojson");
    // Once we get a response, send the data.features object to the createFeatures function
    L.geoJson(data).addTo(map);

// Adding Some Color
function getColor(d) {
    return d > 8000000 ? '#800026' :
           d > 7000000  ? '#BD0026' :
           d > 6000000  ? '#E31A1C' :
           d > 5000000  ? '#FC4E2A' :
           d > 4000000   ? '#FD8D3C' :
           d > 3000000  ? '#FEB24C' :
           d > 2000000  ? '#FED976' :
           d > 1000000  ? '#f8eccb' :

                      '#FFEDA0';
}

// defining a styling function for our GeoJSON layer so that its fillColor depends on feature.properties.density property
function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.75
    };
}

L.geoJson(data, {style: style}).addTo(map);

// Adding Interaction
// define event listener or layer mouseover event(make the states highlighted visually )
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.75
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties)
}

//   we’ll define what happens on mouseout. The handy geojson.resetStyle method will reset the layer style to its default state (defined by our style function).

function resetHighlight(e) {

//     var geojson;
// // ... our listeners
// geojson = L.geoJson(" ");
    geojson.resetStyle(e.target);
}

//


// define a click listener that zooms to the state:
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


// useing the onEachFeature option to add the listeners on our state layers:
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// Custom Info Control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (properties) {
    this._div.innerHTML = '<h4>US deaths</h4>' +  (properties ?
        '<b>' + properties.name + '</b><br />' + properties.density + ' people '
        : 'Hover over a state');
};
info.addTo(map);



// Custom Legend Control

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend1'),
        grades = [8000000, 7000000, 6000000, 5000000, 4000000, 3000000, 2000000, 1000000],

       
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);



})()



console.log("found me!")

// Create map object and set default layers
// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
}).addTo(myMap);

// choice of map styles
// mapbox.streets
// mapbox.light
// mapbox.dark
// mapbox.satellite
// mapbox.streets-satellite
// mapbox.wheatpaste
// mapbox.streets-basic
// mapbox.comic
// mapbox.outdoors
// mapbox.run-bike-hike
// mapbox.pencil
// mapbox.pirates
// mapbox.emerald
// mapbox.high-contrast

var markers = L.layerGroup().addTo(myMap);

function buildMap(year){
    console.log(year);
    var url = `/position/${year}`;
    d3.json(url).then(function(response) {

    // clear out old markers
    markers.clearLayers();

     for (var i = 0; i < Object.keys(response.longitude).length; i++) {
      var yearly = response.iyear[i];
      console.log(yearly)
       var latitude = response.latitude[i];
       var longitude = response.longitude[i];
       if (!isNaN(latitude)) {
         markers.addLayer(L.marker([latitude, longitude]))
        // L.marker([latitude, longitude]).addTo(markers);
       }
     }

    myMap.addLayer(markers);
     });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/years").then((Years) => {
    Years.forEach((year) => {
      selector
        .append("option")
        .text(year)
        .property("value", year);
    });

    const firstYear = Years[0];
    buildMap(firstYear);
//     Use the first sample from the list to build the initial plots
//     const firstSample = sampleNames[0];
//     buildCharts(firstSample);
//     buildMetadata(firstSample);
   });
 }

//
function optionChanged(newYear) {
// Fetch new data each time a new sample is selected
 //  layerGroup.clearLayers();
   console.log(newYear);
   buildMap(newYear);
//   buildMetadata(newSample);
}

// Initialize the dashboard
init();




// function buildCharts(sample) {
//
//   // @TODO: Use `d3.json` to fetch the sample data for the plots
//   var url = `/samples/${sample}`;
//   d3.json(url).then(function(data) {
//
//     // @TODO: Build a Bubble Chart using the sample data
//     var exes = data.otu_ids;
//     var whys = data.sample_values;
//     var bigosmallo = data.sample_values;
//     var colors = data.otu_ids; // add a little pizzazz
//     var text_stuff = data.otu_labels;
//
//     var trace1 = {
//       x: exes,
//       y: whys,
//       text: text_stuff,
//       mode: 'markers',
//       marker: {
//         color: colors,
//         size: bigosmallo
//       }
//     };
//
//     var doom = [trace1];
//
//     var layout = {
//       xaxis: { title: "OTU ID"},
//       // how do I get better more interesting colors?
//     };
//
//     Plotly.newPlot('bubble', doom, layout);
//
// });
// }

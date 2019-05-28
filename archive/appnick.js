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
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

function buildMap(){

    d3.json("/latlong").then(function(response) {

      thing= response.centlat;
     for (var i = 0; i < Object.keys(response.longitude).length-1; i++) {
       var latitude = response.latitude[i];
       var longitude = response.longitude[i];
       console.log(latitude);
       if (!isNaN(latitude)) {
         console.log('made it!');
         L.marker([latitude, longitude]).addTo(myMap);
       }
     }

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

    buildMap();
//     Use the first sample from the list to build the initial plots
//     const firstSample = sampleNames[0];
//     buildCharts(firstSample);
//     buildMetadata(firstSample);
   });
 }

//
// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
// }

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

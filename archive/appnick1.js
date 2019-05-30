console.log("launching map of TERROR!")

//Create layer groups: one for each terror attack group
var markers = L.layerGroup();
var assasination = L.layerGroup();
var kidnapping = L.layerGroup();
var bombing = L.layerGroup();
var facility = L.layerGroup();
var armed = L.layerGroup();
var hijacking = L.layerGroup();
var unknown = L.layerGroup();
var unarmed = L.layerGroup();
var hostage = L.layerGroup();

//Set up icon class
var terrorIcon = L.Icon.extend({
    options: {
        iconSize: [25,25],
    //    popupAnchor: [-3,25]
    }
})

//Set up each icon image for each layer above
var assaIcon = new terrorIcon({iconUrl:'static/icons/assassin.png'}),
      kidnIcon = new terrorIcon({iconUrl:'/static/icons/kidnapping.png'}),
      bombIcon = new terrorIcon({iconUrl:'/static/icons/bomb.png'}),
      faciIcon = new terrorIcon({iconUrl:'/static/icons/infrastructure.png'}),
      armeIcon = new terrorIcon({iconUrl:'/static/icons/armedassault.png'}),
      hijaIcon = new terrorIcon({iconUrl:'/static/icons/hijack.png'}),
      unknIcon = new terrorIcon({iconUrl:'/static/icons/question.png'}),
      unarIcon = new terrorIcon({iconUrl:'/static/icons/punch.png'}),
      hostIcon = new terrorIcon({iconUrl:'/static/icons/hostage.png'});

//Set up map instance
var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [assasination, kidnapping, bombing, facility, armed, hijacking, unknown, unarmed, hostage]
 });

 // Add a tile layer
 var landMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 18,
   id: "mapbox.light",
   accessToken: API_KEY
 }).addTo(myMap);

// define contol titles for map
 var overlayMaps = {
     "Assasination": assasination,
     "Kidnapping": kidnapping,
     "Bombing": bombing,
     "Facility/Infrastructure": facility,
     "Armed Assault": armed,
     "Hijacking": hijacking,
     "Unknown": unknown,
     "Unarmed Assault": unarmed,
     "Hostage Taking": hostage
 };

 // Pass our map layers into our layer control
 // Add the layer control to the map
 // Using null due to single baseMap choice
 L.control.layers(null, overlayMaps, {
     collapsed: false
 }).addTo(myMap);


function buildMap(year){
//    console.log(year);
    var url = `/position/${year}`;
    d3.json(url).then(function(response) {

    // clear out old markers on map
    markers.clearLayers();
    assasination.clearLayers();
    kidnapping.clearLayers();
    bombing.clearLayers();
    facility.clearLayers();
    armed.clearLayers();
    hijacking.clearLayers();
    unknown.clearLayers();
    unarmed.clearLayers();
    hostage.clearLayers();

    //cycle through all records and attach the correct icon and location to the correct attack layer
    for (var i = 0; i < Object.keys(response.longitude).length; i++) {
         var yearly = response.iyear[i];
         var latitude = response.latitude[i];
         var longitude = response.longitude[i];
         if (!isNaN(latitude)) {
             switch (response.attacktype1_txt[i]) {
                case 'Assassination':
                    L.marker([latitude, longitude], {icon: assaIcon}).addTo(assasination);
                    break;
                case 'Hostage Taking (Kidnapping)':
                    L.marker([latitude, longitude], {icon: kidnIcon}).addTo(kidnapping);
                    break;
                case 'Bombing/Explosion':
                    L.marker([latitude, longitude], {icon: bombIcon}).addTo(bombing);
                    break;
                case 'Facility/Infrastructure Attack':
                    L.marker([latitude, longitude], {icon: faciIcon}).addTo(facility);
                    break;
                case 'Armed Assault':
                    L.marker([latitude, longitude], {icon: armeIcon}).addTo(armed);
                    break;
                case 'Hijacking':
                    L.marker([latitude, longitude], {icon: hijaIcon}).addTo(hijacking);
                    break;
                case 'Unknown':
                    L.marker([latitude, longitude], {icon: unknIcon}).addTo(unknown);
                    break;
                case 'Unarmed Assault':
                    L.marker([latitude, longitude], {icon: unarIcon}).addTo(unarmed);
                    break;
                case 'Hostage Taking (Barricade Incident)':
                    L.marker([latitude, longitude], {icon: hostIcon}).addTo(hostage);
                    break;
                default:
                    L.marker([latitude, longitude], {icon: unknIcon}).addTo(unknown);
                    break;
                }
          }
     }
     });
};


function buildBubble(year) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/bubble/${year}`;
  d3.json(url).then(function(response) {

      var arr = response.country_txt;
      var lookup = {};
      var countryExe = [];
      var countryCount = 0;

      for (var i = 0; i < Object.keys(response.country).length; i++) {
          if(!(arr[i] in lookup)){
              lookup[arr[i]] = 1;
              countryCount +=1;
              countryExe.push(countryCount);
          }
          else{ lookup[arr[i]] += 1;
          }
      }
      var countries = Object.keys(lookup);
      var counts = Object.values(lookup);
     var exes = countryExe;
     var whys = counts;
     var bigosmallo = counts;
    var colors = countryExe; // add a little pizzazz
    var text_stuff = countries;

     var trace1 = {
       x: exes,
       y: whys,
       text: text_stuff,
       mode: 'markers',
       marker: {
        color: colors,
        colorscale: 'Jet',
        size: bigosmallo,
        sizeref: 2.0 * Math.max(...bigosmallo) / (50**2),
        sizemode: 'area'
       }
    };

     var doom = [trace1];

    var layout = {
       xaxis: {
           autotick: true,
           showgrid: false,
           zeroline: false,
           ticks: '',
           showticklabels: false
       },
       margin: {
           l: 50,
           r: 50,
           b: 5,
           t: 10,
           pad: 0
       },
    //   // how do I get better more interesting colors?
     };
    //
    Plotly.newPlot('chart-02', doom, layout, {responsive: true});
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selYears");
  var bubbleSelector = d3.select("#bubSelYears");
  // Use the list of sample names to populate the select options
  d3.json("/years").then((Years) => {
    Years.forEach((year) => {
      selector
        .append("option")
        .text(year)
        .property("value", year);
      bubbleSelector
       .append("option")
       .text(year)
       .property("value", year);
    });

    const firstYear = Years[0];
    buildMap(firstYear);
    buildBubble(firstYear);
   });




 }

function optionChanged(newYear) {
   buildMap(newYear);
}

function countryOptionChange(newYear) {
   buildMap(newYear);
}

function bubbleOptionChange(newYear) {
    buildBubble(newYear);
}

// Initialize the dashboard
init();

var app = new Framework7({
    // App root element
    el: '#app',
    routes: [
        {
            path: '/',
            url: 'index.html',
        },
        {
            path: '/page2/',
            url: 'pages/page2.html',
        },
    ],
    // ... other parameters
});
var mainView = app.views.create('.view-main')

document.addEventListener('deviceready', onDeviceReady, false);

var $$ = Dom7;
var lat;
var long;
var geoOpts = {
    enableHighAccuracy: true
}

var tracking = false;
var targetLat;
var targetLong;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOpts);
}
function geoSuccess(position) {
    console.log(position);
    lat = position.coords.latitude
    long = position.coords.longitude;
    $("#currentPos").append("<p>" + lat + ", " + long + "</p>")
}
function geoError(message) {
    alert(message.message)
}

var watchID;
function watchSuccess(position) {
    console.log(position);
    lat = position.coords.latitude;
    long = position.coords.longitude;
    $("#currentPos").append("<p>" + lat + ", " + long + ": "+calcRotation() +"</p>")
    $("#currentPos").append("<p>" + lat + ", " + long + "</p>")
}

function toggleTracking(){
    if (tracking == true){
        tracking = false;
        document.getElementById("buttonText").innerHTML = "Track";
        navigator.geolocation.clearWatch(watchID)
    }
    else{
        tracking = true;
        document.getElementById("buttonText").innerHTML = "Found it";
        watchID = navigator.geolocation.watchPosition(watchSuccess, geoError, geoOpts)
        targetLat = lat;
        targetLong = long;
    }
}

function calcRotation(){
    var latVec = targetLat - lat;
    var longVec = targetLong - long;
    var angle = Math.atan(latVec/longVec);
    if (longVec < 0){
        angle+= 180;
    }
    return String(angle);
}
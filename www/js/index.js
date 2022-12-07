var app = new Framework7({
    // App root element
    el: '#app',
    routes: [
        {
            path: '/',
            url: 'index.html',
        },
    ]
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
var compassHeading = 0;


function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOpts);
    //navigator.compass.getCurrentHeading(compassSuccess, compassError, [compassOptions]);
}
//locationfunction



var watchID;
function geoSuccess(position) {
    console.log(position);
    lat = position.coords.latitude;
    long = position.coords.longitude;
    document.getElementById("currentAngle").innerHTML = "<p>"+calcRotation() +"&#176;</p>";
    document.getElementById("currentDist").innerHTML = "<p>" +calcDist() +"m</p>";//why are these not running?
    document.getElementById("debug").innerHTML = "<p>" + lat + ", " + long + "</p>";
    $(".arrow").css("transform", "rotateZ(" + calcRotation() + "deg)");
}
function geoError(message) {
    alert(message.message)
}
//compass
/*var compassOptions = {
    frequency:250
}
var watchID2;
function compassSuccess(heading) {
    compassHeading = heading.magneticHeading;
};

function compassError(compassError) {
    alert('Compass error: ' + compassError.code);
};*/
//other
function toggleTracking(){
    if (tracking == true){
        tracking = false;
        document.getElementById("buttonText").innerHTML = "Track";
        navigator.geolocation.clearWatch(watchID);
        //navigator.compass.clearWatch(watchID2);
    }
    else{
        tracking = true;
        document.getElementById("buttonText").innerHTML = "Found it";
        watchID = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOpts);
        //watchID2 = navigator.compass.watchHeading(compassSuccess, compassError, [compassOptions]);
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
    //angle = angle - compassHeading;
    angle -=90;//account for rotation of the image

    return String(angle%360);
}
function calcDistance(){
    var dist = getDistanceFromLatLonInKm(lat, long, targetLat, targetLong);
    dist = dist*1000;//convert to meters
    dist = Math.ceil(dist / 5)*5;//round to the nearest 5
    return String(dist);
}

// Credit https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

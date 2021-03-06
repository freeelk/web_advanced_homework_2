'use strict';

/**
 * Google map
 */
function initMap() {
    var markerPos = {lat: 50.479144, lng: 34.965221};
    var center = {lat: 47.589144, lng: 28.965221};
    var mapContainer =document.getElementById('map');

    if (!mapContainer) {
        return;
    }

    var map = new google.maps.Map(mapContainer, {
        zoom: 6,
        center: center,
        disableDefaultUI: true,
        scrollwheel: false,
        styles: [{"stylers":[{"hue":"#61dac9"},{"saturation":3}]},{"featureType":"water","stylers":[{"color":"#61dac9"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},
            {featureType:"administrative",elementType:"labels",stylers:[{visibility:"on"}]},{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]}]
    });
    var marker = new google.maps.Marker({
        position: markerPos,
        map: map,
        icon: "/assets/img/icons/map_marker.png"
    });
}

module.exports = initMap;
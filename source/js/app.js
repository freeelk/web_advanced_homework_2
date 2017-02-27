/**
 * Google map
 */
function initMap() {
  var markerPos = {lat: 50.479144, lng: 34.965221};
  var center = {lat: 47.589144, lng: 28.965221};

  var mapContainer = document.getElementById('map');
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


/**
 * Flip block on index page
 */
function flipGreetingBox() {
    document.getElementById("greeting-flip").classList.toggle('hover');
}


/**
 * Parallax on scroll
 *
 * @type {{move, init}}
 */
var parallax = (function(){
   return {
       move: function (block, windowScroll, strafeAmount) {
           var strafe = windowScroll / -strafeAmount-50 + '%';
           var transformString = 'translate3d(-50%, ' + strafe + ', 0)';
           var style = block.style;

           style.transform = transformString;
       },
       init: function(wScroll, bg, user, sectionText ) {
            this.move(bg, wScroll, 45);
            this.move(sectionText, wScroll, 20);
            this.move(user, wScroll, 3);
       }
   }
}());

window.onscroll = function() {
    var bg = document.querySelector('.hero__bg-img');
    var user = document.querySelector('.hero-title-pic');
    var sectionText = document.querySelector('.hero__author-container');
    if (bg && user && sectionText) {
        var wScroll = window.pageYOffset;
        parallax.init(wScroll, bg, user, sectionText);
    }

}


/**
 * Parallax on mouse move
 * @type {Element}
 */
var parallaxContainer = document.getElementById('parallax');
if (parallaxContainer) {
    var layers = parallaxContainer.children;

    window.onmousemove =function(e) {
        var pageX = e.pageX,
            pageY = e.pageY,
            initialX = (window.innerWidth /2) - pageX,
            initialY = (window.innerHeight /2) - pageY;


        Array.from(layers).forEach(function(layer, i) {
            var divider = i / 100;
            var positionX = initialX * divider;
            var positionY = initialY * divider;

            transformString = 'translate3d(' + positionX +'px, ' + positionY +'px, 0)';
            layer.style.transform = transformString;
        });

    };

}

/**
 * Hamburger button transform
 * @type {Element}
 */
var heroHamburger = document.getElementById("hero-hamburger");
if (heroHamburger) {
    heroHamburger.addEventListener("click", menuClick, false);
}

function menuClick() {
    this.classList.toggle('hamburger_active');
    console.log('click');
}
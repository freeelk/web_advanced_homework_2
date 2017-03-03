'use strict';

class ParallaxMouse {

    constructor( parallaxContainer ) {
        this.parallaxContainer = parallaxContainer;
    }

    start() {
        if (this.parallaxContainer) {
            let layers = this.parallaxContainer.children;

            window.addEventListener('mousemove', function (e) {
                let pageX = e.pageX,
                    pageY = e.pageY,
                    initialX = (window.innerWidth /2) - pageX,
                    initialY = (window.innerHeight /2) - pageY;

                Array.from(layers).forEach(function(layer, i) {
                    let divider = i / 100,
                        positionX = initialX * divider,
                        positionY = initialY * divider;

                    layer.style.transform = 'translate3d(' + positionX +'px, ' + positionY +'px, 0)';
                });
            });
        }

    }
}

module.exports = ParallaxMouse;
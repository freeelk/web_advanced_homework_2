'use strict';

class ParallaxScroll {

    constructor( bg, user, sectionText ) {
        this.bg = bg;
        this.user = user;
        this.sectionText = sectionText;
    }

    start() {
        if (this.bg && this.user && this.sectionText) {
            let that = this;

            window.addEventListener('scroll', function () {
                let wScroll = window.pageYOffset;
                that.move(that.bg, wScroll, 45);
                that.move(that.sectionText, wScroll, 20);
                that.move(that.user, wScroll, 3);
            });
        }
    }

    move(block, windowScroll, strafeAmount) {
        var strafe = windowScroll / - strafeAmount-50 + '%';
        var transformString = 'translate3d(-50%, ' + strafe + ', 0)';
        var style = block.style;

        style.transform = transformString;
    }

}

module.exports = ParallaxScroll;
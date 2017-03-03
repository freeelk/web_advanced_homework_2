'use strict';

class Blur {
    constructor(wrapper, formBlur, posTop) {
        this.wrapper = wrapper;
        this.formBlur = formBlur;
        this.posTop = posTop;
    }

    start() {
        if (this.wrapper && this.formBlur) {
            let that = this;

            window.addEventListener('load', function(){
                that.set();
            });

            window.addEventListener('resize', function(){
                that.set();
            });
        }
    }

    set() {
        let posLeft = - this.wrapper.offsetLeft,
            posTop =  - this.posTop,
            blurCss = this.formBlur.style;

            blurCss.backgroundPosition = posLeft + 'px ' + posTop + 'px';
    }
}


module.exports = Blur;
/*

var blur = (function () {
    var wrapper = document.querySelector('.connect-me');
    var form = document.querySelector('.connect-me__blur');

    return {
        set: function() {
            var posLeft = -wrapper.offsetLeft;
            var posTop =  -625;
            var blurCss = form.style;

            blurCss.backgroundPosition = posLeft + 'px ' + posTop + 'px';
        }
    }
}());


window.addEventListener('load', function(){
    blur.set();
});


window.onresize = function() {
        blur.set();
    }*!/
*/

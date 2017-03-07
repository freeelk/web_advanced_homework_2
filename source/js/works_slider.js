/**
 * Created by freeelk on 05.03.17.
 */

'use strict';

var textAnimation = require('./text_animation');

const PATH_TO_PREVIEWS = '/assets/img/content/slider/';

class SlideButton {
    constructor(currentImgSrc, cssClasses) {
        this.cssClasses = cssClasses;

        let image = this.getElementByClassName(this.cssClasses.shownCssClass);
        image.src = currentImgSrc;
    }

    slideNext(nextImgSrc) {
        let image1 = this.getElementByClassName(this.cssClasses.shownCssClass);
        let image2 = this.getElementByClassName(this.cssClasses.belowCssClass);

        if (!(image1 && image2)) {
            return;
        }

        image2.src = nextImgSrc;
        image1.classList.remove('no-transition');
        image2.classList.remove('no-transition');
        image1.classList.remove(this.cssClasses.shownCssClass);
        image1.classList.add(this.cssClasses.aboveCssClass);
        image2.classList.add(this.cssClasses.shownCssClass);
        image2.classList.remove(this.cssClasses.belowCssClass);

        let that = this;

        image1.addEventListener("transitionend", restorePositions, false);

        function restorePositions() {
            image1.classList.add('no-transition');
            image1.classList.remove(that.cssClasses.aboveCssClass);
            image1.classList.add(that.cssClasses.belowCssClass);
            image1.removeEventListener("transitionend", restorePositions);
        }
    }

    slidePrev(prevImgSrc) {
        let image1 = this.getElementByClassName(this.cssClasses.shownCssClass);
        let image2 = this.getElementByClassName(this.cssClasses.aboveCssClass);

        if (!(image1 && image2)) {
            return;
        }

        image2.src = prevImgSrc;
        image1.classList.remove('no-transition');
        image2.classList.remove('no-transition');
        image1.classList.remove(this.cssClasses.shownCssClass);
        image1.classList.add(this.cssClasses.belowCssClass);
        image2.classList.add(this.cssClasses.shownCssClass);
        image2.classList.remove(this.cssClasses.aboveCssClass);


        let that = this;

        image1.addEventListener("transitionend", restorePositions, false);

        function restorePositions() {
            image1.classList.add('no-transition');
            image1.classList.remove(that.cssClasses.belowCssClass);
            image1.classList.add(that.cssClasses.aboveCssClass);
            image1.removeEventListener("transitionend", restorePositions);
        }
    }

    getElementByClassName(className) {
        let elements = document.getElementsByClassName(className);
        return elements[0];
    }

}

class WorksSlider {
    constructor(data, templateElements) {
        this.data = data;
        this.templateElements = templateElements;
        this.currentItem = 0;


        let leftSlideButtonCssClasses = {
            shownCssClass: 'slider__switch-img_left_shown',
            aboveCssClass: 'slider__switch-img_left_above',
            belowCssClass: 'slider__switch-img_left_below'
        };

        this.leftSlideButton = new SlideButton(
            PATH_TO_PREVIEWS + this.getData(this.nextCount()).preview,
            leftSlideButtonCssClasses
        );


        let rightSlideButtonCssClasses = {
            shownCssClass: 'slider__switch-img_right_shown',
            aboveCssClass: 'slider__switch-img_right_above',
            belowCssClass: 'slider__switch-img_right_below'
        };

        this.rightSlideButton = new SlideButton(
            PATH_TO_PREVIEWS + this.getData(this.prevCount()).preview,
            rightSlideButtonCssClasses
        );
    }

    showItem() {
        let currentData = this.getData();

        this.leftSlideButton.slideNext(PATH_TO_PREVIEWS + this.getData(this.nextCount()).preview);
        this.rightSlideButton.slidePrev(PATH_TO_PREVIEWS + this.getData(this.prevCount()).preview)

        this.templateElements.link.href = currentData.link;
        this.templateElements.preview.src = PATH_TO_PREVIEWS + currentData.preview;
        textAnimation.generate(currentData.title, this.templateElements.title.id);
        textAnimation.generate(currentData.skills, this.templateElements.skills.id);

    }

    nextCount() {
        return this.currentItem == this.data.length - 1 ? 0 : this.currentItem + 1;
    }

    prevCount() {
        return this.currentItem == 0 ? this.data.length - 1 : this.currentItem - 1;
    }

    next(){
        this.currentItem = this.nextCount();
        this.showItem();
    }

    prev(){
        this.currentItem = this.prevCount();
        this.showItem();
    }

    getData(currentItem = this.currentItem) {
        return this.data[currentItem];
    }

    init(itemNumber = 0) {
        this.currentItem = itemNumber;
        this.showItem();
    }

}

module.exports = WorksSlider;

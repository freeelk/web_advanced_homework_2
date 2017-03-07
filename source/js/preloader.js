'use strict';

class Image {
    constructor(element, progress) {
        this.element = element;
        this.imageSrc = element.src;
        this.element.src = '';
        this.progress = progress;
    }

    load() {
        let that = this;
        return new Promise(function(resolve,reject) {
            that.element.src = that.imageSrc;
            that.element.onload = function() {
                that.progress.increment();
                resolve(that.element);
            };
            that.element.onerror = function(e) {
                that.progress.increment();
                resolve(that.element); // Даже если не получилось загрузить, все равно продолжаем
            };
        })
    }
}

class Progress {
    constructor(imagesCount, preloader, preloaderPercents) {
        this.preloaderPercents = preloaderPercents;
        this.imagesCount = imagesCount;
        this.loadedCount = 0;
        this.preloader = preloader;
    }

    increment() {
        this.loadedCount++;
        this.showPercent();
        if (this.loadedCount == this.imagesCount) {
            this.hidePreloader();
        }
    }

    showPercent() {
        let percent = Math.ceil(this.loadedCount / this.imagesCount * 100);
        this.preloaderPercents.innerText = percent + '%';
    }

    hidePreloader() {
        setTimeout(()=> this.preloader.classList.toggle('hidden'), 300);
    }
}

class Preloader {

    constructor(imagesContainer, preloader, preloaderPercents) {
        if (imagesContainer && preloader, preloaderPercents) {
            let imgElems = Array.prototype.slice.call(imagesContainer.getElementsByTagName('img'));
            this.progress = new Progress(imgElems.length, preloader, preloaderPercents);

            this.images = [];
            imgElems.forEach(imageElem => this.images.push(new Image(imageElem, this.progress)));
        }
    }

    // Придумал загружать картинки последовательно, чтоб красивее отображались проценты,
    // хотя реально это будет дольше
    loadImages() {
        let images = this.images;
        let promise = images[0].load();

        for (let i= 1; i < images.length; i++) {
            promise = promise.then(() => {
                return images[i].load();
            });
        }
    }

    init() {
        if (this.images) {
            this.loadImages();
        }
    }
}

module.exports =  Preloader;
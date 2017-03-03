'use strict';

let initMap = require('./google_map.js');
let flipGreetingBox = require('./flip_box.js');
let ParallaxScroll = require('./parallax_scroll');
let ParallaxMouse = require('./parallax_mouse');
let Blur = require('./blur');

/**
 * Карта Google на странице About
 */
initMap(document.getElementById('map'));


/**
 *  Переключение Flip-бокса на индексной странице
 */
flipGreetingBox(document.getElementById("greeting-flip"), document.getElementById('greeting__athorizate'));


/**
 * Параллакс по прокрутке страницы
 *
 * @type {parallaxScroll}
 */
let parallaxScroll = new ParallaxScroll(
    document.querySelector('.hero__bg-img'),
    document.querySelector('.hero-title-pic'),
    document.querySelector('.hero__author-container')
);
parallaxScroll.start();

/**
 * Параллакс по движению мышки
 *
 * @type {parallaxMouse}
 */
let parallaxMouse = new ParallaxMouse(document.getElementById('parallax'));
parallaxMouse.start();

var wrapper = document.querySelector('.connect-me');
var form = document.querySelector('.connect-me__blur');
let blur = new Blur(wrapper, form, 625);
blur.start();

/**
* Hamburger button transform
* @type {Element}
*/

var heroHamburger = document.getElementById("hero-hamburger");
if (heroHamburger) {
    heroHamburger.addEventListener("click", function(){
        this.classList.toggle('hamburger_active');
    });
}

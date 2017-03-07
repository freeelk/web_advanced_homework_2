'use strict';

let initMap = require('./google_map');
let flipGreetingBox = require('./flip_box');
let ParallaxScroll = require('./parallax_scroll');
let ParallaxMouse = require('./parallax_mouse');
let Blur = require('./blur');
let Preloader = require('./preloader');
let scrollMenu = require('./blog_menu');
let WorksSlider = require('./works_slider');


let preloader = new Preloader(
    document.getElementById('parallax'),
    document.getElementById('preloader'),
    document.getElementById('preloader-percents')
);
preloader.init();


/**
 * Карта Google на странице About
 */
initMap();

/**
 *  Переключение Flip-бокса на индексной странице
 */
flipGreetingBox(document.getElementById("greeting-flip"), document.getElementById('greeting__athorizate'));
flipGreetingBox(document.getElementById("greeting-flip"), document.getElementById('to-index-page'));


/**
 * Форма авторизации
 */
$( "#authorization" ).submit(function( event ) {
    if ( !($("#no_robot").prop( "checked" ) &&  ($('input[name=no_robot_radio]:checked', '#authorization').val() == 1))) {
        $("#validation-message").text(' Роботы нам не нужны');
    } else {
        $("#validation-message").text('Верю, что человек. Сабмит реализую позже');
    };

    event.preventDefault();
});


/**
 * Форма отправки сообщения
 */
$( "#connect-me-form" ).submit(function( event ) {
        $('input[name=name]', "#connect-me-form" ).val('');
        $('input[name=email]', "#connect-me-form").val('');
        $('input[name=message]', "#connect-me-form").val('');
        $("#validation-message").text('Форму отправлено');

    event.preventDefault();
});

$('input', "#connect-me-form" ).on('change', function() {
    $("#validation-message").text('');
});


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
 *  Скролл меню на странице блога
 */

if ($('.news').length > 0 &&
    $('.blog__menu-item').length > 0 &&
    $('.blog__wrap-menu').length > 0) {
    scrollMenu.init();
}


let data = [
    {
        title: 'Пример сайта  1',
        skills: 'html, css, javascript',
        link: 'http://site1.com',
        preview: '1.png'
    },
    {
        title: 'Сайт 2. Пример',
        skills: 'html, css, javascript, jQuery',
        link: 'http://site2.com',
        preview: '2.png'
    },
    {
        title: 'Сайт 3 Еще один пример',
        skills: 'Angular2',
        link: 'http://site3.com',
        preview: '3.png'
    },
    {
        title: 'Сайт 4 Четрвертый сайт',
        skills: 'php, Yii2',
        link: 'http://site4.com',
        preview: '4.png'
    }
];


let templateElements = {
    title: document.getElementById('slider-title'),
    skills: document.getElementById('slider-skills'),
    link: document.getElementById('slider-link'),
    preview: document.getElementById('slider-preview'),
    prev: document.getElementById('slider-prev'),
    next: document.getElementById('slider-next'),

};


/**
 * Слайдер сайтов на странице Works
 *
 */
let sliderGoUp = document.getElementById('slider__go-up');
let sliderGoDown = document.getElementById('slider__go-down');

if (sliderGoUp && sliderGoDown) {
    let worksSlider = new WorksSlider(data, templateElements);
    worksSlider.init();
    document.getElementById('slider__go-up').addEventListener("click", ()=> worksSlider.next());
    document.getElementById('slider__go-down').addEventListener("click", ()=> worksSlider.next());
}


/**
* Hamburger button transform
* @type {Element}
*/

var heroHamburger = document.getElementById("hero-hamburger");
var overlay = document.getElementById("overlay");
if (heroHamburger) {
    heroHamburger.addEventListener("click", function(){
        this.classList.toggle('hamburger_active');
        overlay.classList.toggle('open');
    });
}

var slideMenu = document.getElementById("slide-menu");
if (slideMenu) {
    slideMenu.addEventListener("click", () => slideMenu.classList.toggle('slide-menu_collapse'));
}

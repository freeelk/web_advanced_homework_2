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
/*
$( "#authorization" ).submit(function( event ) {
    if ( !($("#no_robot").prop( "checked" ) &&  ($('input[name=no_robot_radio]:checked', '#authorization').val() == 1))) {
        $("#validation-message").text(' Роботы нам не нужны');
    } else {
        $("#validation-message").text('Верю, что человек. Сабмит реализую позже');
    };

    event.preventDefault();
});
*/


$( "#authorization" ).submit(prepareAuth);
/*
const  formLogin = $("#authorization");
if (formLogin) {
    formLogin.addEventListener('submit', prepareAuth);
}*/

function prepareAuth(e) {
    e.preventDefault();

    let resultContainer = $('#validation-message');

    if ( !($("#no_robot").prop( "checked" ) &&  ($('input[name=no_robot_radio]:checked', '#authorization').val() == 1))) {
        $(resultContainer).text(' Роботы нам не нужны');
        return;
    };

    let data = {
        login: this.login.value,
        password: this.password.value
    };

    //console.log(data);
    $(resultContainer).text('Sending...');
    sendAjaxJson('/login', data, function (data) {
        $(resultContainer).text(data);
    });
}

/**
 * Форма отправки сообщения
 */

const formMail = document.querySelector('#connect-me-form');

if (formMail) {
    formMail.addEventListener('submit', prepareSendMail);
}

function prepareSendMail(e) {
    e.preventDefault();
    let resultContainer = document.querySelector('#validation-message');
    let data = {
        name: formMail.name.value,
        email: formMail.email.value,
        text: formMail.message.value
    };
    resultContainer.innerHTML = 'Sending...';
    sendMailData('/contact', data, function (data) {
        resultContainer.innerHTML = data;
    });
}

function sendMailData(url, data, cb) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        let result = JSON.parse(xhr.responseText);
        cb(result.status);
    };
    xhr.send(JSON.stringify(data));
}



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
 * Получаем данные о работах по запросу /worklist
 *
 */
window.addEventListener('load', function () {
    $.getJSON( "/workslist", function( data ) {
        let sliderGoUp = document.getElementById('slider__go-up');
        let sliderGoDown = document.getElementById('slider__go-down');

        if (sliderGoUp && sliderGoDown) {
            let worksSlider = new WorksSlider(data.works, templateElements);
            worksSlider.init();
            document.getElementById('slider__go-up').addEventListener("click", ()=> worksSlider.next());
            document.getElementById('slider__go-down').addEventListener("click", ()=> worksSlider.next());
        }
    });
});



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

/**
 * Табы в админке
 */

$('.admin__tabs-controls-link').on('click', function(e){
    e.preventDefault();

    let item = $(this).closest('.admin__tabs-controls-item');

    let contentItem = $('.admin__tabs-item');
    let itemPosition = item.index();

    contentItem.eq(itemPosition)
        .addClass('admin__tabs-item_active')
        .siblings()
        .removeClass('admin__tabs-item_active');

    item.addClass('admin__tabs-controls-item_active')
        .siblings()
        .removeClass('admin__tabs-controls-item_active');
});

$( '.admin-tabs__file-input' ).each( function()
{
    var $input	 = $( this ),
        $label	 = $input.next( 'label' ),
        labelVal = $label.html();

    $input.on( 'change', function( e )
    {
        var fileName = '';

        if( e.target.value )
            fileName = e.target.value.split( '\\' ).pop();
            console.log(fileName);

        if( fileName )
            $label.html( fileName );
        else
            $label.html( labelVal );
    });

    // Firefox bug fix
    $input
        .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
        .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
});



function sendAjaxJson(url, data, cb) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        let result = JSON.parse(xhr.responseText);
        cb(result.status);
    };
    xhr.send(JSON.stringify(data));
}

/**
 * Skills
 */
const formSkills = document.querySelector('#admin-skills');

if (formSkills) {
    formSkills.addEventListener('submit', prepareSendPostSkills);
}

function prepareSendPostSkills(e) {
    e.preventDefault();

    let resultContainer = document.querySelector('.admin-tab__skills-status');
    let skillsGroups = $('.admin-tabs__skills');

    let data = [];
    $.each(skillsGroups, function(index, value){
        let dataItem = {};
        dataItem.id = $(value).data('id');

        let skillsList = $('.admin-tabs__skill-row', value);
        let skills = {};
        $.each(skillsList, function(index, value){
            let input = $('.admin-tabs__text-input', value);
            let inputName = $(input).attr('name');
            let inputValue = $(input).val();
            skills[inputName] = inputValue;
        });

        dataItem.skills = skills;
        data.push(dataItem);
    });

    resultContainer.innerHTML = 'Sending...';
    sendAjaxJson('/setskills', data, function (data) {
        resultContainer.innerHTML = data;
    });
}


/**
 * Blog
 */
const formBlog = document.querySelector('#admin-blog');

if (formBlog) {
    formBlog.addEventListener('submit', prepareSendPostBlog);
}

function prepareSendPostBlog(e) {
    e.preventDefault();

    let resultContainer = document.querySelector('.admin-tab__blog-status');
    let data = {
        title: document.getElementById('blog-item-name').value,
        date: document.getElementById('blog-item-date').value,
        text: document.getElementById('blog-item-text').value
    };
    resultContainer.innerHTML = 'Sending...';
    sendAjaxJson('/addpost', data, function (data) {
        resultContainer.innerHTML = data;
        document.querySelector('#admin-blog').reset();
    });
}


/**
 *  Загрузка картинок
 */

const formUpload = document.querySelector('#admin-works');

function fileUpload(url, data, cb) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.onload = function (e) {
        let result = JSON.parse(xhr.responseText);
        cb(result.status);
    };

    xhr.send(data);
}

function prepareSendFile(e) {
    e.preventDefault();
    let resultContainer = document.querySelector('.admin-tab__works-status');
    let formData = new FormData();
    let file = document
        .querySelector('#works-image-upload')
        .files[0];
    let title = document
        .querySelector('#works-title')
        .value;

    let skills = document
        .querySelector('#works-skills')
        .value;

    let link = document
        .querySelector('#works-link')
        .value;

    formData.append('photo', file, file.name);
    formData.append('title', title);
    formData.append('skills', skills);
    formData.append('link', link);

    resultContainer.innerHTML = 'Uploading...';
    fileUpload('/upload', formData, function (data) {
        resultContainer.innerHTML = data;
        document.querySelector('#admin-works').reset();
        $('.admin__tabs__file-input-label').text('Загрузить картинку');
    });
}

if (formUpload) {
    formUpload.addEventListener('submit', prepareSendFile);
}
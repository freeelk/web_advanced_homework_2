'use strict';




var scrollMenu = (function () {
    var $news = $('.news'),
        $item = $('.blog__menu-item'),
        $itemSlide = $('.blog__menu-item'),
        $wrapMenu = $('.blog__wrap-menu'),
        body = document.body,
        isPositionArticle = [],
        offsetHeight = 200,

        positionArticle = function (element) {
            var len = element.length;
            for (let i = 0; i < len; i++) {
                isPositionArticle[i] = {};
                isPositionArticle[i].top = element
                        .eq(i)
                        .offset()
                        .top - offsetHeight;
                isPositionArticle[i].bottom = isPositionArticle[i].top + element
                        .eq(i)
                        .innerHeight();
            }
        },

        scrollPageFixMenu = function (e) {
            var scroll = window.pageYOffset;
            if (scroll < $news.offset().top) {
                $wrapMenu.removeClass('fixed');
            } else {
                $wrapMenu.addClass('fixed');
            }
        },

        scrollPage = function (e) {
            var scroll = window.pageYOffset;
            for (let i = 0; i < isPositionArticle.length; i++) {
                if (scroll >= isPositionArticle[i].top && scroll <= isPositionArticle[i].bottom) {
                    $('.slide__menu-item')
                        .eq(i)
                        .addClass('blog__menu-item_slide-menu_selected')
                        .siblings()
                        .removeClass('blog__menu-item_slide-menu_selected');
                    $item
                        .eq(i)
                        .addClass('blog__menu-item_selected')
                        .siblings()
                        .removeClass('blog__menu-item_selected');
                    //console.log(i);
                }
            }
        },

        clickOnMenu = function (e) {
            var index = $(e.target).index();
            var sectionOffset = $news
                .eq(index)
                .offset()
                .top;
            $(document).off('scroll', scrollPage);
            $('body, html').animate({
                'scrollTop': sectionOffset
            }, function () {
                $(e.target)
                    .addClass('blog__menu-item_selected')
                    .siblings()
                    .removeClass('blog__menu-item_selected');
                $(document).on('scroll', scrollPage);
            });
        },

        addListener = function () {
            $('.blog__menu').on('click', clickOnMenu);

            $(document).on('scroll', scrollPage);
            $(document).on('scroll', scrollPageFixMenu);

            $(window).on('load', function (e) {
                positionArticle($news);
            })

            $(window).on('resize', function (e) {
                positionArticle($news);
            })
        }

    return {
        init: addListener
    }
})();

module.exports =  scrollMenu;


var currentSlideNum = 2;
var newMarginLeft = 0;
var bannerCount;
var banner;
$(function () {
    bannerCount = $('.bannerRotation .slides .slide').length;
    $('.bannerRotation .slides .slide:first-child').clone().insertAfter('.bannerRotation .slides .slide:last');
    bannerSize();
    dotNavigationSetup();
    var numberSlide = parseFloat("7000");
    banner = window.setInterval(changeSlide, numberSlide);
});

$(window).resize(function () {
    bannerSize();
})

function changeSlide() {
    if (currentSlideNum > bannerCount) {
        currentSlideNum = 1;
        var nextSlide = $('.slide:first-child');
        window.setTimeout(function () {
            newMarginLeft = 0;
            $('.bannerRotation .slides').css({
                marginLeft: 0
            })
        }, 500);

    } else {
        var nextSlide = $('.slide.active').next('.slide');
    }

    newMarginLeft = newMarginLeft + 100;
    var currentSlide = $('.slide.active');
    var slideActive = nextSlide.attr('data-position');
    $('.dotNavigation div').removeClass('active');
    $('.dotNavigation div[data-slidenum="' + slideActive + '"]').addClass('active');
    $('.bannerRotation .slides').animate({
        marginLeft: '-' + newMarginLeft + '%'
    });
    currentSlide.removeClass('active');
    nextSlide.addClass('active');
    currentSlideNum = currentSlideNum + 1;
}

function bannerSize() {
    var bannerWidth = $('.bannerRotation').width();
    var slideContainerWidth = (bannerCount + 1) * bannerWidth;
    $('.bannerRotation .slides').css({
        width: slideContainerWidth
    });
    var bannerHeight = $('.bannerRotation .slides .slide:first-child img').height();
    $('.bannerRotation').css({
        height: bannerHeight
    });
}

function dotNavigationSetup() {
    $('.dotNavigation').css({
        width: bannerCount * 20
    });
    for (var i = 0; i < bannerCount; i++) {
        $('.dotNavigation').append('<div ' + ((i == 0) ? 'class="active"' : '') + ' data-slidenum="' + (i + 1) + '"></div>');
    }
}

$(document).on('click', '.dotNavigation div', function () {
    clearInterval(banner);
    var slideToGoTo = $(this).data('slidenum');
    var percentToMove = (slideToGoTo - 1) * 100;

    $('.dotNavigation div').removeClass('active');

    $(this).addClass('active');

    currentSlideNum = slideToGoTo + 1;
    newMarginLeft = percentToMove;
    $('.bannerRotation .slides').animate({
        marginLeft: '-' + newMarginLeft + '%'
    });
    $('.slide.active').removeClass('active');
    $('.slide[data-order="' + slideToGoTo + '"]').addClass('active');
    var timeToSlide = parseFloat("7000");
    banner = window.setInterval(changeSlide, timeToSlide); 
})
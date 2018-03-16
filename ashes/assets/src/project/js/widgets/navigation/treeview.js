$(document).ready(function () {
    $('.leftnav .current').parents('li').addClass('active');
});
$('.leftnav ul > li').each(function () {
    if ($(this).find('ul').length > 0) {
        $(this).addClass('expandable');
        $(this).children('.leftnav-item').prepend('<span class="expand"></span>');
    }
});

$(document).on('click', '.expand', function (e) {
    $(this).closest('li').toggleClass('active');
});
$(document).on('click', '.expandable > .leftnav-item > .group, .expandable > .leftnav-item > .current', function (e) {
    e.preventDefault();
    $(this).closest('li').toggleClass('active');
});
$(document).on('hover', '.expandable > .leftnav-item > .group, .expandable > .leftnav-item > .current', function (e) {
    $(this).parent().children('.expand').css('color', (e.type === 'mouseenter' ? '#ee2a24' : '#000'));
});


var leftNavOpen = false;

function toggleLeftNav() {
    var leftNav = $(".leftnav-container");
    var leftNavOpenButton = $(".leftnav-open-btn");
    var curtain = $(".has-leftnav .curtain");

    if (!leftNavOpen) {
        leftNav.addClass("open");
        leftNavOpenButton.addClass("hidden");
        curtain.addClass("open");
    } else {
        leftNav.removeClass("open");
        leftNavOpenButton.removeClass("hidden");
        curtain.removeClass("open");
    }

    leftNavOpen = !leftNavOpen;
}

// Close mobile left nav when curtain is clicked
$(document).on("click", ".has-leftnav .curtain", function () {
    $(".leftnav-container").removeClass("open");
    $(".leftnav-open-btn").removeClass("hidden");
    $(".has-leftnav .curtain").removeClass("open");
    leftNavOpen = false;
});
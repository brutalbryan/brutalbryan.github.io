$(function () {
    $(document).on('click', 'a.tab-link', function(e) {
        e.preventDefault();
        var tabNumber = $(this).attr('href');
        console.log(tabNumber);
        $(tabNumber).children('a').click();

        $('html, body').animate({
            scrollTop: $(tabNumber).offset().top - 15
        }, 700);
    })
})
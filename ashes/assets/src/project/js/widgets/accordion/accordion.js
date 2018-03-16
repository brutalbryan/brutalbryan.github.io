$(function () {
    if (window.location.href.indexOf('/edit') > -1 || window.location.href.indexOf('/InEdit') > -1) {
        $('<style>.accordion-content {height: 100% !important; }</style>').appendTo('head');
    }  else {
        $(document).on("click", ".accordion-title", function () {
            $(this).addClass('active');
            var getHeight = $(this).next().children().outerHeight();
            var containerHeight = $(this).next().height();
            if (containerHeight === 1) {
                $(this).next().css({
                    height: getHeight
                });
            } else {
                $(this).next().css({
                    height: 0
                });
                $(this).removeClass('active');
            }
        })
    }
});

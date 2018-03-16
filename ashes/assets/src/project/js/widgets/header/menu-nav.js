//************************************************************************************************

//                                              Updated Nav and Mobile Begins

//************************************************************************************************

var menuOpen = false;               // Whether or not the menu is currently open
var animatingMenu = false;          // Whether or not there is an animation happening
var selectedTopLevelMenu = "";      // Name of the selected top level menu item
var animationTime = 200;            // Time in ms for menu animations
var mobileWidth = 1020;             // Width when mobile menu should show in px
var hId = null;                       // Hightlight data-attr
var lastArrow = null;               // last open arrow in subNav



/*
 * Check to see if user's screen size is less than or equal to mobileWidth
 */
function checkMobile() {
    return (window.innerWidth <= mobileWidth);
}

/*
 * Open the mobile navigation menu
 */
function openMenu() {

    // Check if the menu is open and return if already open
    if (menuOpen) return;
    menuOpen = true;

    // Add .noscroll to body
    $("body").addClass("noscroll");

    // Add .noscroll to html
    $("html").addClass("noscroll");

    // Add .active to .mobileMenu
    $(".mobileMenu").addClass("active");

    // Animate .mobileMenu into screen with a left of 0
    $(".mobileMenu").animate({ "left": "0" }, animationTime);

    // Reset overflow-y on .mobileMenu .container so it scrolls
    $(".mobileMenu .container").css("overflow-y", "auto");
}

/*
 * Select submenu to open and open it
 */
function selectMenu(context) {

    // Submenu data attribute of link
    var targetSubmenu = context.dataset.submenu;

    // Use targetSubmenu to grab corresponding submenu in .foldingNavigation
    var selectedSubmenu =
        $(".foldingNavigation .container").filter(function (index) {
            return $(this).hasClass(targetSubmenu);
        })[0];

    // Check if the menu is being animated or if there is no corresponding
    // submenu and return if so
    if (animatingMenu || !selectedSubmenu) return;
    animatingMenu = true;

    // Add .active to .foldingNavigation
    $(".foldingNavigation").addClass("active");

    // Add .active to the selected submenu
    $(selectedSubmenu).addClass("active");

    // Hide overflow-y on .mobileMenu .container
    $(".mobileMenu .container").css("overflow-y", "hidden");

    // Set title of menu to the selected navigation item's title
    selectedTopLevelMenu = $(context).clone().children().remove().end().text();
    $(".mobileMenu__title").text(selectedTopLevelMenu);

    // Add .submenu-active to .mobileMenu
    $(".mobileMenu").addClass("submenu-active");

    // Animate the top level navigation item .container within .mobileMenu
    // off of the page
    $(".mobileMenu .container").animate({ "left": "-100%" }, animationTime, function () {

        // Add .hidden to navigation item .container
        $(this).addClass("hidden");

    });

    // Animate .foldingNavigation into the page
    $(".foldingNavigation").animate({ "left": "0" }, animationTime, function () {
        animatingMenu = false;
    });

}



/*
 * On load, add arrows to the end of menu items that contain submenus
 */
    // Append arrows to .mobileMenu links with submenus
    $(".mobileMenu li a:not(.linkTo)").append("<span class='nav-arrow'>&rsaquo;</span>");

    // Find anchors within lists in .nav-list and append to them
    $(".nav-list li a:not(.linkTo)").append(function () {

        // Check if menu item has a nested list or targets a submenu
        if (!($(this).parent("li").children("ul")[0] === undefined)) {
            if ($(this).parent("li").children("ul")[0] || this.dataset.submenu)
                return "<span class='nav-arrow'>&rsaquo;</span>";
        }

    });



/*
 * Click event for opening the mobile navigation menu
 */
$(document).on("click", ".nav__open-menu", function (e) {

    // Check if user is on a mobile-sized screen and return if not
    if (!checkMobile()) return;

    // Open the mobile menu
    openMenu();

});

/*
 * Click event for selecting a tab in the navigation bar
 */
$(document).on("click", ".nav__tabs a:not(.linkTo)", function (e) {

    // Check if user is on a mobile-sized screen and return if not
    if (!checkMobile()) return;

    // Check if the menu is open and return if it is
    if (menuOpen) return;

    // Prevent default action of clicking an anchor
    e.preventDefault();

    // Check if link has a submenu in dataset
    if (this.dataset.submenu) {

        // Open the navigation menu
        openMenu();

        // Use clicked tab to determine selected submenu and open it
        selectMenu(this);

    }

});

/*
 * Click event for links in .mobileMenu, which consists of all top level
 * navigation items
 */
$(document).on("click", ".mobileMenu li > a:not(.linkTo)", function (e) {

    // Check if user is on a mobile-sized screen and return if not
    if (!checkMobile()) return;

    // Check if the menu is open and return if closed
    if (!menuOpen) return;

    // Prevent default action of clicking an anchor
    e.preventDefault();

    // Use clicked menu item to determine selected submenu and open it
    selectMenu(this);

});

/*
 * Click even of links in .foldingNavigation, which consists of all submenus
 * and is displayed after an initial selection in .mobileMenu has been made
 */
$(document).on("click", ".foldingNavigation li:not(.btm) > a", function (e) {

    // Check if user is on a mobile-sized screen and return if not
    if (!checkMobile()) return;

    // Check if the menu is open and returns if closed
    if (!menuOpen) return;

    // Prevent default action of clicking an anchor
    e.preventDefault();

    // The next menu nested in the li that contains the anchor clicked
    var nextMenu = $(this).parent("li").children("ul")[0];

    // The current menu displayed
    var currentMenu = $(this).parent("li").parent("ul")[0];

    // Check if the menu is being animated or if there is no next menu and
    // return if so
    if (animatingMenu || !nextMenu) return;
    animatingMenu = true;

    // Set next menu to .active and .current
    $(nextMenu).addClass("active current");

    // Set title of menu to the selected navigation item's title
    $(".mobileMenu__title")
        .text($(this).clone().children().remove().end().text());

    // Reset the scroll position of .foldingNavigation to top (0)
    $(".foldingNavigation")[0].scrollTop = 0;

    // Animate active .container in .foldingNavigation left -100% in order to
    // display next submenu
    $(".foldingNavigation .container.active")
        .animate({ "left": "-=100%" }, animationTime, function () {

            // Remove .current from the current menu
            if (currentMenu) $(currentMenu).removeClass("current");

            // Ensure .foldingNavigation has .submenu-active set
            $(".foldingNavigation").addClass("submenu-active");

            animatingMenu = false;

        });

});

/*
 * Click event of menu back button, navigate back through the navigation menu
 */
$(document).on("click", "a.mobileMenu__back", function (e) {

    // Check if user is on a mobile-sized screen and return if not
    if (!checkMobile()) return;

    // Check if the menu is open and returns if closed
    if (!menuOpen) return;

    // Prevent default action of clicking an anchor
    e.preventDefault();

    // The menu that was previously open (contains the current menu)
    var previousMenu = $("ul.current").parent("li").parent("ul")[0];

    // The current menu displayed
    var currentMenu = $("ul.current")[0];

    // Check if the menu is being animated and returns if so
    if (animatingMenu) return;
    animatingMenu = true;

    // Navigate back to top tier navigation menu if no previous menu exists
    if (!previousMenu) {

        // Remove .hidden from .mobileMenu .container
        $(".mobileMenu .container").removeClass("hidden");

        // Remove .submenu-active from .mobileMenu
        $(".mobileMenu").removeClass("submenu-active");

        // Animate .foldingNavigation off of the page
        $(".foldingNavigation").animate({ "left": "100%" }, animationTime, function () {

            // Remove .active from .foldingNavigation
            $(".foldingNavigation").removeClass("active");

            // Remove .active from all .containers in .foldingNavigation
            $(".foldingNavigation .container").removeClass("active");

            animatingMenu = false;

        });

        // Animate the top level navigation item container within .mobileMenu
        // back on to the page
        $(".mobileMenu .container").animate({ "left": "0" }, animationTime, function () {

            // Reset overflow-y on .mobileMenu .container so it scrolls
            $(this).css("overflow-y", "auto");
        });

        // Return because previous menu doesn't exist
        return;

    }

    // Add .active and .current to previous menu if it isn't the first menu of
    // .foldingNavigation, which consists of uls of all columns
    if ($(previousMenu).parent("li").parent("ul")[0])
        $(previousMenu).addClass("active current");

    // Set title of menu to the previous menu's title if there is one, or
    // the selected top level menu's name if not
    $(".mobileMenu__title")
        .text($(previousMenu)
            .parent("li").children("a").clone().children().remove().end()
            .text() || selectedTopLevelMenu);

    // Reset the scroll position of .foldingNavigation to top (0)
    $(".foldingNavigation")[0].scrollTop = 0;

    // Remove submenu-active class if previous menu is not within an li
    if (!$("ul.current").parent("li").parent("ul").parent("li")[0])
        $(".foldingNavigation").removeClass("submenu-active");

    // Animate active .container in .foldingNavigation left +100% in order to
    // display previous submenu
    $(".foldingNavigation .container.active")
        .animate({ "left": "+=100%" }, animationTime, function () {

            // Remove .active and .current from current menu if it exists
            if (currentMenu) $(currentMenu).removeClass("active current");

            animatingMenu = false;

        });

});

/*
 * Click event of the menu close button, close navigation menu
 */
$(document).on("click", "a.mobileMenu__close", function (e) {

    // Check if user is on a mobile-sized screen and return if not
    if (!checkMobile()) return;

    // Check if the menu is closed and returns if already closed
    if (!menuOpen) return;
    menuOpen = false;

    // Prevent default action of clicking an anchor
    e.preventDefault();

    // Animate .mobileMenu to left 100% (off the screen)
    $(".mobileMenu").animate({ "left": "100%" }, animationTime);

    // Animate .foldingNavigation to left 100% (off the screen)
    $(".foldingNavigation").animate({ "left": "100%" }, animationTime, function () {

        // Reset .container back to its default left of 0
        $(".container").css("left", "0");

        // Remove .active and .current from all uls
        $("ul.active").removeClass("current").removeClass("active");

        // Removes .active from all .containers in .foldingNavigation
        $(".foldingNavigation .container").removeClass("active");

        // Remove .submenu-active from .foldingNavigation
        $(".foldingNavigation").removeClass("submenu-active");

        // Remove .hidden from .mobileMenu .container
        $(".mobileMenu .container").removeClass("hidden");

        // Remove .submenu-active from .mobileMenu
        $(".mobileMenu").removeClass("submenu-active");

        // Remove .active from .mobileMenu and .foldingNavigation
        $(".mobileMenu").removeClass("active");
        $(".foldingNavigation").removeClass("active");

        // Check if left nav is closed
        //if (!leftNavOpen) {

        // Remove .noscroll from body
        $("body").removeClass("noscroll");

        // Remove .noscroll from html
        $("html").removeClass("noscroll");

        //}

    });

});


$(document).ready(function () {

    function ExpandTopNavHighlight() {

        $('div.open > div.open').children().each(function () {
            if ($(this).hasClass('highlight')) {
                var highlightHeight = $($(this).children('.active').children('.active')).height() != null ? $($(this).children('.active').children('.active')).height() : 350;
                // expand column dividers

                $('.foldingNavigation').css({ height: highlightHeight });
                $('.foldingNavigation .active').css({ height: highlightHeight });
                $('.foldingNavigation .container .columns').css({ height: highlightHeight });
            }
        });
    }

    var checkContactMyMicrochip = new RegExp(/\/contactus|\/mymicrochip|\/myMicrochip/)

    function DisplayHighlightImage(id) {
        var highlightImage = $('#' + id + ' div > img');
        var highlightImgUrl = highlightImage.attr('data-navImgUrl');
        var highlightImgWidth = highlightImage.attr('data-navImgWidth');
        highlightImage.attr('src', highlightImgUrl);
        highlightImage.attr('width', highlightImgWidth);
    }

    $('header nav a').on('click', function (e) {

        // index placeholder to connect nav item to foldingnav item
        var openNavIndex = 0;

        // for mobile
        if (checkMobile()) return;

        // check for contact us tab or Microchip login  also accounts for /zh/ and /ja/
        if (!(checkContactMyMicrochip.test($(this).attr('href')))) {

            // disallow it act like an anchor
            e.preventDefault();

            // check if this is the second click
            if (typeof $(this).parent().data('priorClick') !== 'undefined') {

                // stores prior n-thchild index -- +1 b/c jquery starts at 1
                openNavIndex = Number($(this).parent().data('priorClick')) + 1;


                // reset prior foldingNav
                collapesPriorNavTab(openNavIndex);

            }

            // close tab
            if ($(this).parent().data('priorClick') === $(this).parent().children('a').index(this)) {
                $(".foldingNavigation").removeClass('open').removeAttr('style');
                $(this).parent().removeData('priorClick');
                $(this).removeClass('open');
                return;
            }

            // stores nav nth-child index
            openNavIndex = $(this).parent().children('a').index(this) + 1;
            // display a default highlight item
            $('.foldingNavigation > div:nth-child(' + openNavIndex + ') .highlight > div:first-child').addClass('active');
            // creates the tab on current nav header
            $(this).addClass('open');

            $(this).parent().data('priorClick', $(this).parent().children('a').index(this));
            // adds foldingnav container
            $('.foldingNavigation').addClass('open');
            // displays nav content
            $('.foldingNavigation > div:nth-child(' + openNavIndex + ')').addClass('open');
            ExpandTopNavHighlight();

            DisplayHighlightImage($('.foldingNavigation > div.open > .highlight > div:first-child').attr('id'));

        }
    });



    // works backwards to restart the all the heights and remove all open classes
    function collapesPriorNavTab(PriorNavTab) {

        // removes tab from the last clicked nav item
        $('nav a:nth-of-type(' + PriorNavTab + 'n)').removeClass('open');

        // remove subMenuSub Height
        $('.foldingNavigation.open > div:nth-child(' + PriorNavTab + ') > .columns > ul > li.open > ul > li.open >  ul').css({ height: '0px' });

        // remove subMenu open class
        $('.foldingNavigation.open > div:nth-child(' + PriorNavTab + ') .container.open > div >  ul > li.open').removeClass('open');

        // remove subMenu height
        $('.foldingNavigation.open > div:nth-child(' + PriorNavTab + ') > .columns > ul > li.open > ul').removeAttr('style');


        // remove menu open class
        $('.foldingNavigation.open > div:nth-child(' + PriorNavTab + ') > .columns > ul > li.open').removeClass('open');

        // removes open class from last folding nav item
        $('.foldingNavigation > div:nth-child(' + PriorNavTab + ')').removeClass('open');

        $('.foldingNavigation.open > div:nth-child(' + PriorNavTab + ') > .highlight ').removeAttr('style');
        $('.foldingNavigation.open > div:nth-child(' + PriorNavTab + ') > .highlight .active').removeAttr('style');
        $('.foldingNavigation.open > div:nth-child(' + PriorNavTab + ') > .highlight .active').removeClass('active');
    }

    function expandChildren(obj) {
        var multiLineCounter = 0;
        if ($(obj).is('ul')) {
            if (lastArrow != null) {
                $(lastArrow).removeAttr('style');
            }

            if ($(obj).parent().parent().height() < $('.foldingNavigation.open').height()) {
                $(obj).parent().parent().css({ height: 'auto' });

            }
            var multiLineCounter = 0;
            $(obj).children().each(function () {
                if ($(this).children('a').text().length > 37) // check for text wrapping in subnav items
                    multiLineCounter += 19;
            });

            var h = ($(obj[0]).children().length * 19) + multiLineCounter;
            $(obj).css({ height: h });
            lastArrow = obj;
            CompareTopNavHeights($(obj));
        }
    }


    function CompareTopNavHeights(obj) {
        window.setTimeout(function () {
            var currentColumn = $(obj).closest('div').children('ul').outerHeight(true);
            $(obj).closest('div').siblings().each(function () {

                if ($(this).height() > currentColumn)

                    currentColumn = $(this).outerHeight(true);

                else if ($(this).hasClass('highlight')) {
                    
                    var targetHighlight = $('.highlight div.active .highlight-content').eq(($('.highlight > .active').length > 1) ? 1 : 0);
                    if (targetHighlight.outerHeight(true) > currentColumn) {
                        currentColumn = targetHighlight.outerHeight(true);
                    }

                }

                $('.highlight > div').css({ height: currentColumn });
                $('.foldingNavigation.open').css({ height: currentColumn });
            });
        }, 280)
    }

    $('.foldingNavigation .container .columns > ul > li > a').on('click', function (e) {

        if (checkMobile()) return;
        if (!$(this).parent().hasClass('btm'))
            e.preventDefault();

        // remove active class from prior highlight item

        if (hId !== null) {
            if ($('.foldingNavigation .container.open .highlight #' + hId).index() > 0) {
                $('#' + hId).removeClass('active');
            }
        }

        $('.foldingNavigation .container .columns ul li.open ul').removeAttr('style');
        $('.foldingNavigation .container .columns ul li.open').removeClass('open');
        $(this).parent().addClass('open');

        // global var - get data attribute
        hId = $(this).parent().attr('data-hid');

        // display corresponding highlight
        if ($('#' + hId).parent('.highlight').length === 1) {

            $('.highlight').removeClass('active');
            $('.highlight #' + hId).addClass('active');
            DisplayHighlightImage(hId);
        }
        else {

            DisplayHighlightImage($('.foldingNavigation .open div:first-child .highlight div:first-child').attr('data-hid'));
        }

        expandChildren($(this).siblings('ul'));

    });

    $('.foldingNavigation .container .columns ul > li > ul > li > a').on('click', function (e) {

        if (checkMobile()) return;

        e.stopPropagation();

        //Close all parent menu items
        $('.foldingNavigation .container .columns ul > li > ul > li.open').removeClass('open');
        var subHeight = Number($(this).attr('subHeight'));
        var parentHeight = Number($(this).parent('ul').parent('li').attr('subHeight'));
        $(this).parent().addClass('open');

        expandChildren($(this).siblings('ul'));

    });


});

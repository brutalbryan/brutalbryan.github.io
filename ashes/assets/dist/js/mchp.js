$(document).ready(function() {
    $(".leftnav .current").parents("li").addClass("active");
});

$(".leftnav ul > li").each(function() {
    if ($(this).find("ul").length > 0) {
        $(this).addClass("expandable");
        $(this).children(".leftnav-item").prepend('<span class="expand"></span>');
    }
});

$(document).on("click", ".expand", function(e) {
    $(this).closest("li").toggleClass("active");
});

$(document).on("click", ".expandable > .leftnav-item > .group, .expandable > .leftnav-item > .current", function(e) {
    e.preventDefault();
    $(this).closest("li").toggleClass("active");
});

$(document).on("hover", ".expandable > .leftnav-item > .group, .expandable > .leftnav-item > .current", function(e) {
    $(this).parent().children(".expand").css("color", e.type === "mouseenter" ? "#ee2a24" : "#000");
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

$(document).on("click", ".has-leftnav .curtain", function() {
    $(".leftnav-container").removeClass("open");
    $(".leftnav-open-btn").removeClass("hidden");
    $(".has-leftnav .curtain").removeClass("open");
    leftNavOpen = false;
});

function openLink(culture) {
    var url = $('[data-sf-role="' + culture + '"]').val();
    window.location = url;
}

function initiateLangSelectorForIS() {
    var langCookie = "MCHP=";
    var currentSavedLang;
    var cookies = document.cookie.split(";");
    var selectedLanguage = $(".language").find(":selected").text();
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(langCookie) === 0) {
            var langTaken = c.substring(langCookie.length, c.length);
        }
    }
    if (langTaken === "Style=jp") {
        currentSavedLang = "Japanese";
        $(".language").empty();
        $(".language").append("<option>Japanese</option><option>Chinese</option><option>English</option>");
    } else if (langTaken === "Style=cn") {
        currentSavedLang = "Chinese";
        $(".language").empty();
        $(".language").append("<option>Chinese</option><option>English</option><option>Japanese</option>");
    } else if (langTaken === "Style=en") {
        currentSavedLang = "English";
        $(".language").empty();
        $(".language").append("<option>English</option><option>Japanese</option><option>Chinese</option>");
    } else {
        $(".language").empty();
        $(".language").append("<option>English</option><option>Japanese</option><option>Chinese</option>");
    }
    $(".language").change(function() {
        var currentLocation = window.location.pathname + window.location.search;
        var redirectPage = currentLocation;
        selectedLanguage = $(".language").find(":selected").text();
        if (selectedLanguage === "Japanese") {
            document.cookie = "MCHP=Style=jp; expires=31 Dec 9999 12:00:00 UTC; path=/";
            document.cookie = "CurrentLanguage=jp; expires=31 Dec 9999 12:00:00 UTC; path=/";
            location.href = currentLocation;
        } else if (selectedLanguage === "Chinese") {
            document.cookie = "MCHP=Style=cn; expires=31 Dec 9999 12:00:00 UTC; path=/";
            document.cookie = "CurrentLanguage=cn; expires=31 Dec 9999 12:00:00 UTC; path=/";
            location.href = currentLocation;
        } else if (selectedLanguage === "English") {
            document.cookie = "MCHP=Style=en; expires=31 Dec 9999 12:00:00 UTC; path=/";
            document.cookie = "CurrentLanguage=en; expires=31 Dec 9999 12:00:00 UTC; path=/";
            location.href = currentLocation;
        }
    });
}

var menuOpen = false;

var animatingMenu = false;

var selectedTopLevelMenu = "";

var animationTime = 200;

var mobileWidth = 1020;

var hId = null;

var lastArrow = null;

function checkMobile() {
    return window.innerWidth <= mobileWidth;
}

function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    $("body").addClass("noscroll");
    $("html").addClass("noscroll");
    $(".mobileMenu").addClass("active");
    $(".mobileMenu").animate({
        left: "0"
    }, animationTime);
    $(".mobileMenu .container").css("overflow-y", "auto");
}

function selectMenu(context) {
    var targetSubmenu = context.dataset.submenu;
    var selectedSubmenu = $(".foldingNavigation .container").filter(function(index) {
        return $(this).hasClass(targetSubmenu);
    })[0];
    if (animatingMenu || !selectedSubmenu) return;
    animatingMenu = true;
    $(".foldingNavigation").addClass("active");
    $(selectedSubmenu).addClass("active");
    $(".mobileMenu .container").css("overflow-y", "hidden");
    selectedTopLevelMenu = $(context).clone().children().remove().end().text();
    $(".mobileMenu__title").text(selectedTopLevelMenu);
    $(".mobileMenu").addClass("submenu-active");
    $(".mobileMenu .container").animate({
        left: "-100%"
    }, animationTime, function() {
        $(this).addClass("hidden");
    });
    $(".foldingNavigation").animate({
        left: "0"
    }, animationTime, function() {
        animatingMenu = false;
    });
}

$(".mobileMenu li a:not(.linkTo)").append("<span class='nav-arrow'>&rsaquo;</span>");

$(".nav-list li a:not(.linkTo)").append(function() {
    if (!($(this).parent("li").children("ul")[0] === undefined)) {
        if ($(this).parent("li").children("ul")[0] || this.dataset.submenu) return "<span class='nav-arrow'>&rsaquo;</span>";
    }
});

$(document).on("click", ".nav__open-menu", function(e) {
    if (!checkMobile()) return;
    openMenu();
});

$(document).on("click", ".nav__tabs a:not(.linkTo)", function(e) {
    if (!checkMobile()) return;
    if (menuOpen) return;
    e.preventDefault();
    if (this.dataset.submenu) {
        openMenu();
        selectMenu(this);
    }
});

$(document).on("click", ".mobileMenu li > a:not(.linkTo)", function(e) {
    if (!checkMobile()) return;
    if (!menuOpen) return;
    e.preventDefault();
    selectMenu(this);
});

$(document).on("click", ".foldingNavigation li:not(.btm) > a", function(e) {
    if (!checkMobile()) return;
    if (!menuOpen) return;
    e.preventDefault();
    var nextMenu = $(this).parent("li").children("ul")[0];
    var currentMenu = $(this).parent("li").parent("ul")[0];
    if (animatingMenu || !nextMenu) return;
    animatingMenu = true;
    $(nextMenu).addClass("active current");
    $(".mobileMenu__title").text($(this).clone().children().remove().end().text());
    $(".foldingNavigation")[0].scrollTop = 0;
    $(".foldingNavigation .container.active").animate({
        left: "-=100%"
    }, animationTime, function() {
        if (currentMenu) $(currentMenu).removeClass("current");
        $(".foldingNavigation").addClass("submenu-active");
        animatingMenu = false;
    });
});

$(document).on("click", "a.mobileMenu__back", function(e) {
    if (!checkMobile()) return;
    if (!menuOpen) return;
    e.preventDefault();
    var previousMenu = $("ul.current").parent("li").parent("ul")[0];
    var currentMenu = $("ul.current")[0];
    if (animatingMenu) return;
    animatingMenu = true;
    if (!previousMenu) {
        $(".mobileMenu .container").removeClass("hidden");
        $(".mobileMenu").removeClass("submenu-active");
        $(".foldingNavigation").animate({
            left: "100%"
        }, animationTime, function() {
            $(".foldingNavigation").removeClass("active");
            $(".foldingNavigation .container").removeClass("active");
            animatingMenu = false;
        });
        $(".mobileMenu .container").animate({
            left: "0"
        }, animationTime, function() {
            $(this).css("overflow-y", "auto");
        });
        return;
    }
    if ($(previousMenu).parent("li").parent("ul")[0]) $(previousMenu).addClass("active current");
    $(".mobileMenu__title").text($(previousMenu).parent("li").children("a").clone().children().remove().end().text() || selectedTopLevelMenu);
    $(".foldingNavigation")[0].scrollTop = 0;
    if (!$("ul.current").parent("li").parent("ul").parent("li")[0]) $(".foldingNavigation").removeClass("submenu-active");
    $(".foldingNavigation .container.active").animate({
        left: "+=100%"
    }, animationTime, function() {
        if (currentMenu) $(currentMenu).removeClass("active current");
        animatingMenu = false;
    });
});

$(document).on("click", "a.mobileMenu__close", function(e) {
    if (!checkMobile()) return;
    if (!menuOpen) return;
    menuOpen = false;
    e.preventDefault();
    $(".mobileMenu").animate({
        left: "100%"
    }, animationTime);
    $(".foldingNavigation").animate({
        left: "100%"
    }, animationTime, function() {
        $(".container").css("left", "0");
        $("ul.active").removeClass("current").removeClass("active");
        $(".foldingNavigation .container").removeClass("active");
        $(".foldingNavigation").removeClass("submenu-active");
        $(".mobileMenu .container").removeClass("hidden");
        $(".mobileMenu").removeClass("submenu-active");
        $(".mobileMenu").removeClass("active");
        $(".foldingNavigation").removeClass("active");
        $("body").removeClass("noscroll");
        $("html").removeClass("noscroll");
    });
});

$(document).ready(function() {
    function ExpandTopNavHighlight() {
        $("div.open > div.open").children().each(function() {
            if ($(this).hasClass("highlight")) {
                var highlightHeight = $($(this).children(".active").children(".active")).height() != null ? $($(this).children(".active").children(".active")).height() : 350;
                $(".foldingNavigation").css({
                    height: highlightHeight
                });
                $(".foldingNavigation .active").css({
                    height: highlightHeight
                });
                $(".foldingNavigation .container .columns").css({
                    height: highlightHeight
                });
            }
        });
    }
    var checkContactMyMicrochip = new RegExp(/\/contactus|\/mymicrochip|\/myMicrochip/);
    function DisplayHighlightImage(id) {
        var highlightImage = $("#" + id + " div > img");
        var highlightImgUrl = highlightImage.attr("data-navImgUrl");
        var highlightImgWidth = highlightImage.attr("data-navImgWidth");
        highlightImage.attr("src", highlightImgUrl);
        highlightImage.attr("width", highlightImgWidth);
    }
    $("header nav a").on("click", function(e) {
        var openNavIndex = 0;
        if (checkMobile()) return;
        if (!checkContactMyMicrochip.test($(this).attr("href"))) {
            e.preventDefault();
            if (typeof $(this).parent().data("priorClick") !== "undefined") {
                openNavIndex = Number($(this).parent().data("priorClick")) + 1;
                collapesPriorNavTab(openNavIndex);
            }
            if ($(this).parent().data("priorClick") === $(this).parent().children("a").index(this)) {
                $(".foldingNavigation").removeClass("open").removeAttr("style");
                $(this).parent().removeData("priorClick");
                $(this).removeClass("open");
                return;
            }
            openNavIndex = $(this).parent().children("a").index(this) + 1;
            $(".foldingNavigation > div:nth-child(" + openNavIndex + ") .highlight > div:first-child").addClass("active");
            $(this).addClass("open");
            $(this).parent().data("priorClick", $(this).parent().children("a").index(this));
            $(".foldingNavigation").addClass("open");
            $(".foldingNavigation > div:nth-child(" + openNavIndex + ")").addClass("open");
            ExpandTopNavHighlight();
            DisplayHighlightImage($(".foldingNavigation > div.open > .highlight > div:first-child").attr("id"));
        }
    });
    function collapesPriorNavTab(PriorNavTab) {
        $("nav a:nth-of-type(" + PriorNavTab + "n)").removeClass("open");
        $(".foldingNavigation.open > div:nth-child(" + PriorNavTab + ") > .columns > ul > li.open > ul > li.open >  ul").css({
            height: "0px"
        });
        $(".foldingNavigation.open > div:nth-child(" + PriorNavTab + ") .container.open > div >  ul > li.open").removeClass("open");
        $(".foldingNavigation.open > div:nth-child(" + PriorNavTab + ") > .columns > ul > li.open > ul").removeAttr("style");
        $(".foldingNavigation.open > div:nth-child(" + PriorNavTab + ") > .columns > ul > li.open").removeClass("open");
        $(".foldingNavigation > div:nth-child(" + PriorNavTab + ")").removeClass("open");
        $(".foldingNavigation.open > div:nth-child(" + PriorNavTab + ") > .highlight ").removeAttr("style");
        $(".foldingNavigation.open > div:nth-child(" + PriorNavTab + ") > .highlight .active").removeAttr("style");
        $(".foldingNavigation.open > div:nth-child(" + PriorNavTab + ") > .highlight .active").removeClass("active");
    }
    function expandChildren(obj) {
        var multiLineCounter = 0;
        if ($(obj).is("ul")) {
            if (lastArrow != null) {
                $(lastArrow).removeAttr("style");
            }
            if ($(obj).parent().parent().height() < $(".foldingNavigation.open").height()) {
                $(obj).parent().parent().css({
                    height: "auto"
                });
            }
            var multiLineCounter = 0;
            $(obj).children().each(function() {
                if ($(this).children("a").text().length > 37) multiLineCounter += 19;
            });
            var h = $(obj[0]).children().length * 19 + multiLineCounter;
            $(obj).css({
                height: h
            });
            lastArrow = obj;
            CompareTopNavHeights($(obj));
        }
    }
    function CompareTopNavHeights(obj) {
        window.setTimeout(function() {
            var currentColumn = $(obj).closest("div").children("ul").outerHeight(true);
            $(obj).closest("div").siblings().each(function() {
                if ($(this).height() > currentColumn) currentColumn = $(this).outerHeight(true); else if ($(this).hasClass("highlight")) {
                    var targetHighlight = $(".highlight div.active .highlight-content").eq($(".highlight > .active").length > 1 ? 1 : 0);
                    if (targetHighlight.outerHeight(true) > currentColumn) {
                        currentColumn = targetHighlight.outerHeight(true);
                    }
                }
                $(".highlight > div").css({
                    height: currentColumn
                });
                $(".foldingNavigation.open").css({
                    height: currentColumn
                });
            });
        }, 280);
    }
    $(".foldingNavigation .container .columns > ul > li > a").on("click", function(e) {
        if (checkMobile()) return;
        if (!$(this).parent().hasClass("btm")) e.preventDefault();
        if (hId !== null) {
            if ($(".foldingNavigation .container.open .highlight #" + hId).index() > 0) {
                $("#" + hId).removeClass("active");
            }
        }
        $(".foldingNavigation .container .columns ul li.open ul").removeAttr("style");
        $(".foldingNavigation .container .columns ul li.open").removeClass("open");
        $(this).parent().addClass("open");
        hId = $(this).parent().attr("data-hid");
        if ($("#" + hId).parent(".highlight").length === 1) {
            $(".highlight").removeClass("active");
            $(".highlight #" + hId).addClass("active");
            DisplayHighlightImage(hId);
        } else {
            DisplayHighlightImage($(".foldingNavigation .open div:first-child .highlight div:first-child").attr("data-hid"));
        }
        expandChildren($(this).siblings("ul"));
    });
    $(".foldingNavigation .container .columns ul > li > ul > li > a").on("click", function(e) {
        if (checkMobile()) return;
        e.stopPropagation();
        $(".foldingNavigation .container .columns ul > li > ul > li.open").removeClass("open");
        var subHeight = Number($(this).attr("subHeight"));
        var parentHeight = Number($(this).parent("ul").parent("li").attr("subHeight"));
        $(this).parent().addClass("open");
        expandChildren($(this).siblings("ul"));
    });
});

$(document).ready(function() {
    if (typeof GetCountryCode === "undefined") {
        function GetCountryCode() {
            var currentCountryCode = "";
            var ccCookie = "Country_Code=";
            var ca = document.cookie.split(";");
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == " ") c = c.substring(1, c.length);
                if (c.indexOf(ccCookie) == 0) currentCountryCode = c.substring(ccCookie.length, c.length);
            }
            if (currentCountryCode === "") {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "//freegeoip.net/json/?callback=");
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var cData = JSON.parse(xhr.responseText);
                        currentCountryCode = cData.country_code;
                        var date = new Date();
                        date.setTime(date.getTime() + 24 * 60 * 60 * 1e3);
                        var expires = "; expires=" + date.toGMTString();
                        document.cookie = ccCookie + cData.country_code + expires + "; path=/";
                    }
                };
                xhr.send();
            }
            return currentCountryCode;
        }
    }
    if (typeof _Player !== "undefined" && typeof GetCountryCode !== "undefined" && GetCountryCode() !== "CN") {
        $(".Player").each(function() {
            _Player($(this));
        });
    } else {
        $(".vimeo_video").each(function() {
            $(this).hide();
        });
    }
});

function _GetVideo(ID) {
    var LocalCacheID = "VimeoVideo" + ID;
    var LocalCahcedData = sessionStorage.getItem(LocalCacheID);
    if (!LocalCahcedData) {
        $.ajax({
            url: "https://vimeo.com/api/v2/video/" + ID + ".json",
            async: false,
            dataType: "json",
            success: function(ResponseData) {
                sessionStorage.setItem(LocalCacheID, JSON.stringify(ResponseData[0]));
            }
        });
    }
    return JSON.parse(sessionStorage.getItem(LocalCacheID));
}

function _GetAlbum(ID) {
    var LocalCacheID = "VimeoAlbum" + ID;
    var LocalCahcedData = sessionStorage.getItem(LocalCacheID);
    if (!LocalCahcedData) {
        $.ajax({
            url: "https://vimeo.com/api/v2/album/" + ID + "/videos.json",
            async: false,
            dataType: "json",
            success: function(ResponseData) {
                sessionStorage.setItem(LocalCacheID, JSON.stringify(ResponseData));
            }
        });
    }
    return JSON.parse(sessionStorage.getItem(LocalCacheID));
}

function _GetChannel(ID) {
    var LocalCacheID = "VimeoChannel" + ID;
    var LocalCahcedData = sessionStorage.getItem(LocalCacheID);
    if (!LocalCahcedData) {
        $.ajax({
            url: "https://vimeo.com/api/v2/channel/" + ID + "/videos.json",
            async: false,
            dataType: "json",
            success: function(ResponseData) {
                sessionStorage.setItem(LocalCacheID, JSON.stringify(ResponseData));
            }
        });
    }
    return JSON.parse(sessionStorage.getItem(LocalCacheID));
}

function _PlayerLoadVideo(Target, ID) {
    VideoDetails = _GetVideo(ID);
    Target.find(".Stage").css("padding-top", 100 / (VideoDetails.width / VideoDetails.height) + "%");
    var IframeArguments = new Array();
    var IframeSource = "https://player.vimeo.com/video/" + ID + "?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0";
    if (Target.find(".Stage iframe").length > 0) {
        Target.find(".Stage iframe").prop("src", IframeSource);
    } else {
        IframeArguments.push('src="' + IframeSource + '"');
        IframeArguments.push('width="' + VideoDetails.width + '"');
        IframeArguments.push('height="' + VideoDetails.height + '"');
        IframeArguments.push('frameborder="0"');
        IframeArguments.push("webkitallowfullscreen");
        IframeArguments.push("mozallowfullscreen");
        IframeArguments.push("allowfullscreen");
        Target.find(".Stage").html("<iframe " + IframeArguments.join(" ") + "></iframe>");
    }
    _PlayerAddMeta(Target, VideoDetails.title, VideoDetails.description);
    ActiveMenuItem = Target.find(".PlayListItem" + ID);
    if (ActiveMenuItem.length > 0) {
        ActiveMenuItem.parents(".Player").find("a").removeClass("ActiveItem");
        ActiveMenuItem.addClass("ActiveItem");
    }
    _PlayerResponsive(Target);
}

function _PlayerAddMeta(Target, Title, Description) {
    Target.next(".PlayerMeta").remove();
    if (Title.trim().length || Description.trim().length) {
        var HTML = [];
        if (Title.trim().length) {
            HTML.push("<h3>" + Title + "</h3>");
        }
        if (Description.trim().length) {
            HTML.push("<p>" + Description + "</p>");
        }
        Target.after('<div class="PlayerMeta">' + HTML.join("") + "</div>");
    }
}

function _Player(Target) {
    var HTML = [];
    var VideoItems;
    var Playlist = [];
    if (Target.data("source")) {
        if (Regs = Target.data("source").match(/(vimeo\.com)\/([\d]+)/)) {
            VideoItems = [ _GetVideo(Regs[2]) ];
        } else if (Regs = Target.data("source").match(/(vimeo\.com)\/(channels)\/([\d]+)/)) {
            VideoItems = _GetChannel(Regs[3]);
        } else if (Regs = Target.data("source").match(/(vimeo\.com)\/(album)\/([\d]+)/)) {
            VideoItems = _GetAlbum(Regs[3]);
        }
    }
    if (VideoItems && VideoItems.length > 1) {
        $.each(VideoItems, function(key, value) {
            Playlist.push('<a href="' + value.url + '" title="' + value.title + '" class="PlayListItem' + value.id + '" data-id="' + value.id + '">');
            Playlist.push('<img src="' + value.thumbnail_small + '" />');
            Playlist.push("<div>" + value.title + "</div>");
            Playlist.push("</a>");
        });
        HTML.push('<div class="ListVerticalContainer"><a class="GoUp" href=""><div><i></i></div></a><div class="ListVertical">' + Playlist.join("") + '</div><a class="GoDown" href=""><div><i></i></div></a></div>');
        HTML.push('<div class="StageContainer"><div class="Stage"></div></div>');
        HTML.push('<a class="GoLeft" href=""><div><i></i></div></a>');
        HTML.push('<a class="GoRight" href=""><div><i></i></div></a>');
        HTML.push('<div class="ListHorizontalContainer"><div class="ListHorizontal">' + Playlist.join("") + "</div></div>");
        Target.html(HTML.join(""));
        Target.find("a").unbind("click").bind("click", function(event) {
            event.preventDefault();
            _PlayerLoadVideo(Target, $(this).data("id"));
        });
        $(window).resize(function() {
            _PlayerResponsive(Target);
        });
        $(window).on("orientationchange", function() {
            _PlayerResponsive(Target);
        });
    } else {
        Target.html('<div class="Stage"></div>');
    }
    if (VideoItems && VideoItems.length > 0) {
        _PlayerLoadVideo(Target, VideoItems[0].id);
        if (VideoItems.length > 1) {
            _PlayerResponsive(Target);
        }
    }
}

function _PlayerResponsive(Target) {
    if (Target.width() > 640) {
        Target.find(".StageContainer").css("margin-right", "200px");
        Target.find(".ListHorizontalContainer, .GoLeft, .GoRight").hide();
        Target.find(".ListVerticalContainer").show();
        setTimeout(function() {
            Target.find(".ListVertical").height(Target.find(".StageContainer").height() - 60);
            if (Target.find(".ListVertical").find("a").first().height() * Target.find(".ListVertical").find("a").length < Target.find(".ListVertical").height()) {
                Target.find(".GoUp, .GoDown").hide();
            } else {
                Target.find(".GoUp, .GoDown").show();
            }
        }, 100);
    } else {
        Target.find(".StageContainer").css("margin-right", "0px");
        Target.find(".ListHorizontalContainer, .GoLeft, .GoRight").show();
        Target.find(".ListVerticalContainer").hide();
        if (Target.find(".ListHorizontal").find("a").first().width() * Target.find(".ListHorizontal").find("a").length < Target.find(".ListHorizontal").width()) {
            Target.find(".GoLeft, .GoRight").hide();
        } else {
            Target.find(".GoLeft, .GoRight").show();
        }
    }
    Target.find(".GoUp").unbind("click").bind("click", function(event) {
        event.preventDefault();
        Target.find(".ListVertical").stop().animate({
            scrollTop: "-=" + Target.find(".StageContainer").height() * .75
        }, 750);
    });
    Target.find(".GoDown").unbind("click").bind("click", function(event) {
        event.preventDefault();
        Target.find(".ListVertical").stop().animate({
            scrollTop: "+=" + Target.find(".StageContainer").height() * .75
        }, 750);
    });
    Target.find(".GoLeft").unbind("click").bind("click", function(event) {
        event.preventDefault();
        Target.find(".ListHorizontalContainer").stop().animate({
            scrollLeft: "-=" + Target.find(".StageContainer").width() * .75
        }, 750);
    });
    Target.find(".GoRight").unbind("click").bind("click", function(event) {
        event.preventDefault();
        Target.find(".ListHorizontalContainer").stop().animate({
            scrollLeft: "+=" + Target.find(".StageContainer").width() * .75
        }, 750);
    });
}

var currentSlideNum = 2;

var newMarginLeft = 0;

var bannerCount;

var banner;

$(function() {
    bannerCount = $(".bannerRotation .slides .slide").length;
    $(".bannerRotation .slides .slide:first-child").clone().insertAfter(".bannerRotation .slides .slide:last");
    bannerSize();
    dotNavigationSetup();
    var numberSlide = parseFloat("7000");
    banner = window.setInterval(changeSlide, numberSlide);
});

$(window).resize(function() {
    bannerSize();
});

function changeSlide() {
    if (currentSlideNum > bannerCount) {
        currentSlideNum = 1;
        var nextSlide = $(".slide:first-child");
        window.setTimeout(function() {
            newMarginLeft = 0;
            $(".bannerRotation .slides").css({
                marginLeft: 0
            });
        }, 500);
    } else {
        var nextSlide = $(".slide.active").next(".slide");
    }
    newMarginLeft = newMarginLeft + 100;
    var currentSlide = $(".slide.active");
    var slideActive = nextSlide.attr("data-position");
    $(".dotNavigation div").removeClass("active");
    $('.dotNavigation div[data-slidenum="' + slideActive + '"]').addClass("active");
    $(".bannerRotation .slides").animate({
        marginLeft: "-" + newMarginLeft + "%"
    });
    currentSlide.removeClass("active");
    nextSlide.addClass("active");
    currentSlideNum = currentSlideNum + 1;
}

function bannerSize() {
    var bannerWidth = $(".bannerRotation").width();
    var slideContainerWidth = (bannerCount + 1) * bannerWidth;
    $(".bannerRotation .slides").css({
        width: slideContainerWidth
    });
    var bannerHeight = $(".bannerRotation .slides .slide:first-child img").height();
    $(".bannerRotation").css({
        height: bannerHeight
    });
}

function dotNavigationSetup() {
    $(".dotNavigation").css({
        width: bannerCount * 20
    });
    for (var i = 0; i < bannerCount; i++) {
        $(".dotNavigation").append("<div " + (i == 0 ? 'class="active"' : "") + ' data-slidenum="' + (i + 1) + '"></div>');
    }
}

$(document).on("click", ".dotNavigation div", function() {
    clearInterval(banner);
    var slideToGoTo = $(this).data("slidenum");
    var percentToMove = (slideToGoTo - 1) * 100;
    $(".dotNavigation div").removeClass("active");
    $(this).addClass("active");
    currentSlideNum = slideToGoTo + 1;
    newMarginLeft = percentToMove;
    $(".bannerRotation .slides").animate({
        marginLeft: "-" + newMarginLeft + "%"
    });
    $(".slide.active").removeClass("active");
    $('.slide[data-order="' + slideToGoTo + '"]').addClass("active");
    var timeToSlide = parseFloat("7000");
    banner = window.setInterval(changeSlide, timeToSlide);
});

$(function() {
    if (window.location.href.indexOf("/edit") > -1 || window.location.href.indexOf("/InEdit") > -1) {
        $("<style>.accordion-content {height: 100% !important; }</style>").appendTo("head");
    } else {
        $(document).on("click", ".accordion-title", function() {
            $(this).addClass("active");
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
                $(this).removeClass("active");
            }
        });
    }
});

var paramChart = function() {
    var rowsPerPage, currentPage, allColumnHeaders, allRowData, visibleRowData, branchData, visibleBranchIndex, dataLoaded, chartLoadTicks, dropdownHTML;
    var cachedChartData = [];
    function initVariable() {
        rowsPerPage = 10;
        currentPage = 0;
        allColumnHeaders = [];
        allRowData = [];
        visibleRowData = [];
        dropdownHTML = "";
        branchData = parametricBranchData;
        visibleBranchIndex = 0;
        dataLoaded = false;
        chartLoadTicks = 0;
    }
    function writeParametricChartHTML() {
        if (branchData.length > 1) {
            $(".parametric").append("<div class='parametric__header'><div class='parametric__title'><span class='parametric__title-text'><span class='parametric__title-text-name'></span><i class='fa fa-chevron-down parametric__title-arrow' aria-hidden='true'></i></span><ul class='parametric__title-options'></ul></div><a href='#' target='_blank' class='parametric__view-all-btn'>View All Parametrics</a></div><div class='parametric__options'><div class='parametric__search'><div class='parametric__search-box'><span class='parametric__search-icon'><i class='fa fa-search' aria-hidden='true'></i></span><input type='text' class='parametric__search-input' onkeyup='paramChart.searchTable(event);' placeholder='Search term' required='required' /><span class='clear-input' onclick='paramChart.clearSearch();'>&times;</span></div></div><input type='checkbox' id='parametricColumnsBox' class='parametric__columns-toggle-box' /><label for='parametricColumnsBox' class='parametric__columns-toggle'>Show/Hide Columns</label><ul class='parametric__columns-list'><li class='columns-list__top'><span class='columns-list__reset'>Reset Columns</span><span class='columns-list__close'>&times;</span></li></ul></div><div class='parametric__chart'><div class='parametric-table' data-sortby='0' data-sortorder='0' data-page='0'><div class='table__scrollable-area'><div class='table__row--header'></div></div></div><div class='parametric__pagination'><div class='parametric__pagination-pages'></div><div class='parametric__pagination-total'><span id='currentPageItemNumbers'></span> of <span id='totalTableItems'></span> items</div></div></div>");
            $.each(branchData, function(index, object) {
                dropdownHTML = dropdownHTML + "<li class='" + (index === 0 ? "active" : "") + "' data-branchid=" + object["branchID"] + ">" + object["branchName"] + "</li>";
            });
            $(".parametric__title-options").html(dropdownHTML);
            $(".parametric__title-text-name").text(branchData[visibleBranchIndex]["branchName"]);
        } else {
            $(".parametric").append("<div class='parametric__header'><div class='parametric__title' style='cursor:default'><span class='parametric__title-text'><span class='parametric__title-text-name'></span></span><ul class='parametric__title-options'></ul></div><a href='#' target='_blank' class='parametric__view-all-btn'>View All Parametrics</a></div><div class='parametric__options'><div class='parametric__search'><div class='parametric__search-box'><span class='parametric__search-icon'><i class='fa fa-search' aria-hidden='true'></i></span><input type='text' class='parametric__search-input' onkeyup='paramChart.searchTable(event);' placeholder='Search term' required='required' /><span class='clear-input' onclick='paramChart.clearSearch();'>&times;</span></div></div><input type='checkbox' id='parametricColumnsBox' class='parametric__columns-toggle-box' /><label for='parametricColumnsBox' class='parametric__columns-toggle'>Show/Hide Columns</label><ul class='parametric__columns-list'><li class='columns-list__top'><span class='columns-list__reset'>Reset Columns</span><span class='columns-list__close'>&times;</span></li></ul></div><div class='parametric__chart'><div class='parametric-table' data-sortby='0' data-sortorder='0' data-page='0'><div class='table__scrollable-area'><div class='table__row--header'></div></div></div><div class='parametric__pagination'><div class='parametric__pagination-pages'></div><div class='parametric__pagination-total'><span id='currentPageItemNumbers'></span> of <span id='totalTableItems'></span> items</div></div></div>");
            $(".parametric__title-text-name").text(branchData[visibleBranchIndex]["branchName"]);
        }
    }
    function getJSONDataAndRender(branchID, onDataLoaded) {
        var JSONData = [];
        dataLoaded = false;
        allRowData.length = 0;
        visibleRowData.length = 0;
        allColumnHeaders.length = 0;
        if (chartDataIsCached(branchID)) {
            JSONData.push(getCachedChartData(branchID));
            if (onDataLoaded) onDataLoaded();
            onChartDataLoaded(JSONData);
        } else {
            var connectionURL = "//www.microchip.com/ParamChartSearch/chart.aspx?branchID=";
            var connectionString = connectionURL + branchID + (branchData[visibleBranchIndex]["automotive"] ? "&automotive=1" : "") + (branchData[visibleBranchIndex]["popular"] ? "&popular=1" : "") + "&data=json";
            $.getJSON(connectionString, function(data) {
                JSONData.push(data);
                cachedChartData.push({
                    branchId: branchID,
                    data: data
                });
            }).done(function() {
                if (onDataLoaded) onDataLoaded();
                onChartDataLoaded(JSONData);
            });
        }
    }
    function chartDataIsCached(branchId) {
        var ret = false;
        if (typeof cachedChartData !== "undefined" && cachedChartData.length > 0) {
            $.each(cachedChartData, function(idx, val) {
                if (val.branchId == branchId) ret = true;
            });
        }
        return ret;
    }
    function getCachedChartData(branchId) {
        var ret = null;
        $.each(cachedChartData, function(idx, val) {
            if (val.branchId == branchId) ret = val.data;
        });
        return ret;
    }
    function onChartDataLoaded(JSONData) {
        $.each(JSONData[0], function(index, value) {
            $.each(value, function(key, value) {
                if (!allRowData[index]) allRowData[index] = [];
                allRowData[index].push(value);
                if (!visibleRowData[index]) visibleRowData[index] = [];
                visibleRowData[index].push(value);
            });
        });
        $.each(JSONData[0][0], function(key, value) {
            var keyWithoutUnderscores = key.replace(/_/g, " ");
            allColumnHeaders.push(keyWithoutUnderscores);
        });
        dataLoaded = true;
    }
    function loadChart() {
        if (!$(".parametric__message").length) {
            $(".parametric .parametric__chart").hide();
            $(".parametric").append("<div class='parametric__message'>Loading</div>");
        } else {
            if (chartLoadTicks % 2 === 0) $(".parametric .parametric__message").append(" .");
            if (chartLoadTicks % 8 === 0) $(".parametric .parametric__message").text("Loading");
        }
        chartLoadTicks += 1;
        setTimeout(function() {
            if (dataLoaded) {
                chartLoadTicks = 0;
                if ($(".parametric__message").length) {
                    $(".parametric .parametric__message").remove();
                    $(".parametric .parametric__chart").show();
                }
                buildTable(true);
            } else {
                loadChart();
            }
        }, 250);
    }
    function buildTable(newData) {
        newData = newData || false;
        if (newData) {
            $(".parametric__view-all-btn").attr("href", "//www.microchip.com/ParamChartSearch/chart.aspx?branchID=" + branchData[visibleBranchIndex]["branchID"] + (branchData[visibleBranchIndex]["automotive"] ? "&automotive=1" : "") + (branchData[visibleBranchIndex]["popular"] ? "&popular=1" : ""));
            $(".parametric .table__row--header").empty();
            $(".parametric .parametric__columns-list").contents(":not(.columns-list__top)").remove();
            for (var i = 0; i < allColumnHeaders.length; i++) {
                $(".parametric .table__row--header").append("<div class='table__cell'>" + allColumnHeaders[i] + "</div>");
                if (i === 0) continue;
                $(".parametric").find(".parametric__columns-list").append("<li><input type='checkbox' class='table__header-checkbox' id='tableHeader" + i + "' " + (branchData[visibleBranchIndex]["defaultColumns"].indexOf(i) > -1 ? "checked" : "") + "><label for='tableHeader" + i + "'>" + allColumnHeaders[i] + "</label></li>");
            }
            var parametricChart = $(".parametric .parametric-table");
            var defaultSortBy = branchData[visibleBranchIndex]["sortBy"] || 0;
            var defaultSortOrder = branchData[visibleBranchIndex]["sortOrder"] || 0;
            parametricChart.attr("data-sortby", defaultSortBy);
            parametricChart.attr("data-sortorder", defaultSortOrder);
            sortData();
        }
        $(".parametric .table__row").remove();
        $.each(visibleRowData, function(index, data) {
            if (index < currentPage * rowsPerPage) return;
            if (index >= currentPage * rowsPerPage + rowsPerPage) return false;
            var rowHTML = "<div class='table__row'>";
            $.each(data, function(index, value) {
                var cell = "<div class='table__cell'>";
                if (index === 0) {
                    cell = cell + "<a href='/wwwproducts/" + value + "'>" + value + "</a>";
                } else {
                    cell = cell + value;
                }
                cell = cell + "</div>";
                rowHTML = rowHTML + cell;
            });
            $(".table__scrollable-area").append(rowHTML);
        });
        $(".parametric").find(".parametric__columns-list input[type=checkbox]:checked").each(function(index) {
            var headerNumber = $(this).attr("id").split("tableHeader")[1];
            $(".parametric").find("[class*='table__row']").each(function() {
                $(this).find(".table__cell")[headerNumber].style.display = "inline-block";
            });
        });
        buildPagination();
        resizeColumns();
        restripeRows();
    }
    function buildPagination() {
        $("#totalTableItems").text(visibleRowData.length);
        var lastOnPage = currentPage * rowsPerPage + 10;
        if (lastOnPage > visibleRowData.length) lastOnPage = visibleRowData.length;
        $("#currentPageItemNumbers").text(currentPage * rowsPerPage + 1 + "-" + lastOnPage);
        $(".parametric__pagination-pages").html(function() {
            var allPageButtons = "<span class='parametric__pagination-page-button' data-page='first'><<</span><span class='parametric__pagination-page-button' data-page='prev'><</span>";
            var lowPage = function() {
                var page = currentPage - 1;
                if (page <= 0) page = 1;
                return page;
            };
            var highPage = function() {
                var page = lowPage() + 5;
                if (page > Math.ceil(visibleRowData.length / rowsPerPage)) page = Math.ceil(visibleRowData.length / rowsPerPage) + 1;
                return page;
            };
            for (var i = lowPage(); i < highPage(); i++) {
                allPageButtons = allPageButtons + "<span class='parametric__pagination-page-button " + (i - 1 === currentPage ? "current-page" : "") + "' data-page='" + (i - 1) + "'>" + i + "</span>";
            }
            allPageButtons = allPageButtons + "<span class='parametric__pagination-page-button' data-page='next'>></span><span class='parametric__pagination-page-button' data-page='last'>>></span>";
            return allPageButtons;
        });
    }
    function sortData() {
        var parametricChart = $(".parametric .parametric-table");
        var columnToSortBy = parametricChart.attr("data-sortby");
        var sortOrder = parametricChart.attr("data-sortorder");
        visibleRowData.sort(function(a, b) {
            var compareValue;
            var compareTo;
            if (sortOrder == 0) {
                compareValue = a[columnToSortBy];
                compareTo = b[columnToSortBy];
            } else if (sortOrder == 1) {
                compareValue = b[columnToSortBy];
                compareTo = a[columnToSortBy];
            }
            if (compareValue.startsWith("$")) compareValue = compareValue.slice(1);
            if (compareTo.startsWith("$")) compareTo = compareTo.slice(1);
            if (isNaN(compareValue) || isNaN(compareTo)) {
                return compareValue.toLowerCase() > compareTo.toLowerCase() ? 1 : -1;
            }
            return compareValue - compareTo;
        });
        var sortedColumnHeader = $(".parametric .parametric-table .table__row--header").find(".table__cell")[columnToSortBy];
        $(".parametric .sort-indicator").remove();
        $(sortedColumnHeader).append("<span class='sort-indicator'></span>");
        $(sortedColumnHeader).find(".sort-indicator").html(function() {
            return sortOrder == 0 ? " <i class='fa fa-caret-down' aria-hidden='true'></i>" : sortOrder == 1 ? " <i class='fa fa-caret-up' aria-hidden='true'></i>" : "";
        });
    }
    function getVisibleColumnHeaders() {
        var visibleHeaders = [ "0" ];
        var checkedHeaders = $(".parametric__columns-list input[type=checkbox]:checked");
        $.each(checkedHeaders, function(index, value) {
            visibleHeaders.push($(this).attr("id").split("tableHeader")[1]);
        });
        return visibleHeaders;
    }
    function searchTable(e) {
        if (e != null && e.keyCode == 27) {
            clearSearch();
            return;
        }
        if ($(".parametric__message").length) {
            $(".parametric .parametric__message").remove();
            $(".parametric .parametric__chart").show();
        }
        var searchTerm = $(".parametric .parametric__search input").val();
        var visibleColumnIndexes = getVisibleColumnHeaders();
        var containingRowData = [];
        $.each(allRowData, function(rowIndex, data) {
            $.each(data, function(index, value) {
                if (visibleColumnIndexes.indexOf(index.toString()) === -1) return;
                if (value.toLowerCase().includes(searchTerm.toLowerCase())) {
                    containingRowData.push(data);
                    return false;
                }
            });
        });
        visibleRowData = containingRowData;
        currentPage = 0;
        sortData();
        buildTable();
        if (containingRowData.length <= 0) {
            $(".parametric .parametric__chart").hide();
            $(".parametric").append("<div class='parametric__message'>No results.</div>");
        }
    }
    function clearSearch() {
        $(".parametric .parametric__search input").val("");
        searchTable();
    }
    function restripeRows() {
        $(".parametric .table__row:not(.table__row--header):visible").each(function(index) {
            if (index % 2 === 0) {
                $(this).find(".table__cell").css("background-color", "#FFF");
            } else {
                $(this).find(".table__cell").css("background-color", "#F4F4F4");
            }
        });
    }
    function parametricHasNoData() {
        if (typeof parametricBranchData === "undefined" || parametricBranchData.length <= 0 || parametricBranchData[0].branchID === 0) {
            return true;
        } else {
            return false;
        }
    }
    function resizeColumns() {
        var numColumnsChecked = $(".parametric__columns-list input[type=checkbox]:checked").length;
        $(".parametric").find("[class*='table__cell']").css("width", 100 / numColumnsChecked + "%");
    }
    function init() {
        if (parametricHasNoData()) return;
        $(".parametric").empty();
        $(document).ready(function() {
            initVariable();
            getJSONDataAndRender(branchData[visibleBranchIndex]["branchID"], writeParametricChartHTML);
            loadChart();
            $(document).on("click", ".parametric__title-options > li", function() {
                if (!dataLoaded) return;
                if ($(this).hasClass("active")) return;
                $(".parametric__title-options .active").removeClass("active");
                $(this).addClass("active");
                $(".parametric__title-text-name").text($(this).text());
                visibleBranchIndex = $(this).index();
                currentPage = 0;
                getJSONDataAndRender($(this).attr("data-branchid"));
                loadChart();
            });
            $(document).on("click", ".parametric__pagination-page-button", function() {
                var dataPage = $(this).attr("data-page");
                var newPage = isNaN(dataPage) ? dataPage : parseInt(dataPage);
                var lastPage = Math.ceil(visibleRowData.length / rowsPerPage);
                switch (newPage) {
                  case "first":
                    currentPage = 0;
                    break;

                  case "last":
                    currentPage = lastPage - 1;
                    break;

                  case "prev":
                    if (currentPage - 1 >= 0) {
                        currentPage--;
                    } else {
                        return;
                    }
                    break;

                  case "next":
                    if (currentPage + 1 <= lastPage - 1) {
                        currentPage++;
                    } else {
                        return;
                    }
                    break;

                  default:
                    if (currentPage === newPage) return;
                    currentPage = newPage;
                    break;
                }
                buildTable();
            });
            $(document).on("click", ".parametric .table__row--header .table__cell", function() {
                var parametricChart = $(".parametric .parametric-table");
                var columnToSortBy = $(this).index();
                var newColumnSelected = false;
                if (parametricChart.attr("data-sortby") != columnToSortBy || !parametricChart.attr("data-sortby")) {
                    newColumnSelected = true;
                }
                parametricChart.attr("data-sortby", columnToSortBy);
                parametricChart.attr("data-sortorder", function() {
                    var newSortOrder = parametricChart.attr("data-sortorder") || -1;
                    if (newColumnSelected) newSortOrder = -1;
                    newSortOrder++;
                    return newSortOrder < 2 ? newSortOrder : 0;
                });
                sortData();
                buildTable();
            });
            $(document).on("click", ".parametric .columns-list__close", function() {
                if ($(".parametric__columns-list").css("display") === "block") {
                    $(".parametric__columns-toggle-box").prop("checked", false);
                }
            });
            $(document).on("click", ".parametric .columns-list__reset", function() {
                buildTable(true);
            });
            $(document).on("change", ".parametric .table__header-checkbox", function() {
                var headerNumber = $(this).attr("id").split("tableHeader")[1];
                var checked = $(this).prop("checked");
                $(".parametric").find("[class*='table__row']").each(function() {
                    $(this).find(".table__cell")[headerNumber].style.display = checked ? "inline-block" : "none";
                });
                var parametricChart = $(".parametric .parametric-table");
                if (parametricChart.attr("data-sortby") == headerNumber && !checked) {
                    parametricChart.attr("data-sortby", "0");
                    parametricChart.attr("data-sortorder", "0");
                    sortData();
                }
                searchTable();
                resizeColumns();
            });
            $(document).off("click", ".parametric__title").on("click", ".parametric__title", function(e) {
                if (parametricHasNoData() || branchData.length <= 1) return;
                var options = $(".parametric__title-options");
                var title = $(".parametric__title");
                var titleText = $(".parametric__title-text");
                var columnsToggleBox = $(".parametric__columns-toggle-box");
                var columnsToggle = $(".parametric__columns-toggle");
                var columnsList = $(".parametric__columns-list");
                if (columnsToggle.is(e.target)) {
                    if (!dataLoaded) e.preventDefault();
                }
                if (options.css("display") === "block") {
                    options.hide();
                    titleText.css("opacity", "1");
                    return;
                }
                if (title.is(e.target) || title.has(e.target).length > 0) {
                    if (!dataLoaded) return;
                    options.show();
                    titleText.css("opacity", ".3");
                }
                if (!columnsToggle.is(e.target) && !columnsToggleBox.is(e.target) && !columnsList.is(e.target) && columnsList.has(e.target).length === 0) {
                    if (columnsList.css("display") === "block") {
                        columnsToggleBox.prop("checked", false);
                    }
                }
            });
        });
    }
    return {
        init: init,
        searchTable: searchTable,
        clearSearch: clearSearch
    };
}();

$(document).ready(function() {
    if (!$("body").hasClass(".sfPageEditor")) {
        var panelCounter = 0;
        $(".sfs-tabstrip").each(function() {
            var wrapper = $(this);
            var config = wrapper.find(".sfs-tabstrip-configurator[data-type='bootstrap']");
            if (config.length > 0) {
                var tabs = config.find("li[role='presentation']");
                var panelwrapper = wrapper.find(".tab-panels");
                var panels = panelwrapper.find(".sfs-tabitem");
                tabs.each(function(index) {
                    if (index <= panels.length - 1) {
                        var tab = $(this);
                        var tabId = "panel-" + panelCounter;
                        var link = $(tab.children()[0]);
                        link.attr("data-tab", tabId);
                        var panel = $(panels[index]);
                        panel.attr("id", tabId);
                        if (tab.hasClass("active")) {
                            panel.addClass("active");
                        }
                    }
                    panelCounter = panelCounter + 1;
                });
                var className = config.data("classname");
                if (className !== "") {
                    wrapper.addClass(className);
                }
                wrapper.removeClass("loading");
            }
        });
    }
});

$(document).ready(function() {
    $(document).on("click", ".tab-nav-item:not(.active)", function(e) {
        $this = $(this).children("a");
        e.preventDefault();
        var tabToOpen = $this.data("tab");
        $(".tab-nav-item").removeClass("active");
        $this.parent().addClass("active");
        $("[id*='panel-']").fadeOut();
        window.setTimeout(function() {
            $("#" + tabToOpen).fadeIn();
        }, 400);
    });
});

$(function() {
    $(document).on("click", "a.tab-link", function(e) {
        e.preventDefault();
        var tabNumber = $(this).attr("href");
        console.log(tabNumber);
        $(tabNumber).children("a").click();
        $("html, body").animate({
            scrollTop: $(tabNumber).offset().top - 15
        }, 700);
    });
});
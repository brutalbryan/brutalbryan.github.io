$(document).ready(function () {
    //GetCountryCode is defined in tracking.js in case the getcountrycode is not defined...duplicate code
    if (typeof GetCountryCode === 'undefined') {
        function GetCountryCode() {
            var currentCountryCode = '';
            var ccCookie = 'Country_Code=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(ccCookie) == 0)
                    currentCountryCode = c.substring(ccCookie.length, c.length);
            }
            if (currentCountryCode === '') {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '//freegeoip.net/json/?callback=');
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var cData = JSON.parse(xhr.responseText);
                        currentCountryCode = cData.country_code;
                        var date = new Date();
                        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                        var expires = "; expires=" + date.toGMTString();
                        document.cookie = ccCookie + cData.country_code + expires + '; path=/';
                    }
                }
                xhr.send();
            }

            return currentCountryCode;
        }
    }

    if (typeof _Player !== 'undefined'
        && typeof GetCountryCode !== 'undefined'
        && GetCountryCode() !== 'CN') {
        $('.Player').each(function () {
            _Player($(this));
        });
    } else {
        $('.vimeo_video').each(function () {
            $(this).hide();
        });
    }
});


function _GetVideo(ID) {
    var LocalCacheID = 'VimeoVideo' + ID;
    var LocalCahcedData = sessionStorage.getItem(LocalCacheID);
    if (!LocalCahcedData) {
        $.ajax({ url: 'https://vimeo.com/api/v2/video/' + ID + '.json', async: false, dataType: 'json', success: function (ResponseData) { sessionStorage.setItem(LocalCacheID, JSON.stringify(ResponseData[0])); } });
    }
    return JSON.parse(sessionStorage.getItem(LocalCacheID));
}
function _GetAlbum(ID) {
    var LocalCacheID = 'VimeoAlbum' + ID;
    var LocalCahcedData = sessionStorage.getItem(LocalCacheID);
    if (!LocalCahcedData) {
        $.ajax({ url: 'https://vimeo.com/api/v2/album/' + ID + '/videos.json', async: false, dataType: 'json', success: function (ResponseData) { sessionStorage.setItem(LocalCacheID, JSON.stringify(ResponseData)); } });
    }
    return JSON.parse(sessionStorage.getItem(LocalCacheID));
}
function _GetChannel(ID) {
    var LocalCacheID = 'VimeoChannel' + ID;
    var LocalCahcedData = sessionStorage.getItem(LocalCacheID);
    if (!LocalCahcedData) {
        $.ajax({ url: 'https://vimeo.com/api/v2/channel/' + ID + '/videos.json', async: false, dataType: 'json', success: function (ResponseData) { sessionStorage.setItem(LocalCacheID, JSON.stringify(ResponseData)); } });
    }
    return JSON.parse(sessionStorage.getItem(LocalCacheID));
}
function _PlayerLoadVideo(Target, ID) {
    VideoDetails = _GetVideo(ID);
    Target.find('.Stage').css('padding-top', 100 / (VideoDetails.width / VideoDetails.height) + '%');
    var IframeArguments = new Array();
    var IframeSource = 'https://player.vimeo.com/video/' + ID + '?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0';
    if (Target.find('.Stage iframe').length > 0) {
        Target.find('.Stage iframe').prop('src', IframeSource);
    } else {
        IframeArguments.push('src=\"' + IframeSource + '\"');
        IframeArguments.push('width=\"' + VideoDetails.width + '\"');
        IframeArguments.push('height=\"' + VideoDetails.height + '\"');
        IframeArguments.push('frameborder=\"0\"');
        IframeArguments.push('webkitallowfullscreen');
        IframeArguments.push('mozallowfullscreen');
        IframeArguments.push('allowfullscreen');
        Target.find('.Stage').html('<iframe ' + IframeArguments.join(' ') + '></iframe>');
    }
    _PlayerAddMeta(Target, VideoDetails.title, VideoDetails.description);
    ActiveMenuItem = Target.find('.PlayListItem' + ID);
    if (ActiveMenuItem.length > 0) {
        ActiveMenuItem.parents('.Player').find('a').removeClass('ActiveItem');
        ActiveMenuItem.addClass('ActiveItem');
    }
    _PlayerResponsive(Target);
}
function _PlayerAddMeta(Target, Title, Description) {
    Target.next('.PlayerMeta').remove();
    if (Title.trim().length || Description.trim().length) {
        var HTML = [];
        if (Title.trim().length) {
            HTML.push('<h3>' + Title + '</h3>');
        }
        if (Description.trim().length) {
            HTML.push('<p>' + Description + '</p>');
        }
        Target.after('<div class="PlayerMeta">' + HTML.join('') + '</div>');
    }
}
function _Player(Target) {
    var HTML = [];
    var VideoItems;
    var Playlist = [];
    if (Target.data('source')) {
        if (Regs = Target.data('source').match(/(vimeo\.com)\/([\d]+)/)) {
            VideoItems = [_GetVideo(Regs[2])];
        } else if (Regs = Target.data('source').match(/(vimeo\.com)\/(channels)\/([\d]+)/)) {
            VideoItems = _GetChannel(Regs[3]);
        } else if (Regs = Target.data('source').match(/(vimeo\.com)\/(album)\/([\d]+)/)) {
            VideoItems = _GetAlbum(Regs[3]);
        }
    }
    if (VideoItems && VideoItems.length > 1) {
        $.each(VideoItems, function (key, value) {
            Playlist.push('<a href="' + value.url + '" title="' + value.title + '" class="PlayListItem' + value.id + '" data-id="' + value.id + '">');
            Playlist.push('<img src="' + value.thumbnail_small + '" />');
            Playlist.push('<div>' + value.title + '</div>');
            Playlist.push('</a>');
        });
        HTML.push('<div class="ListVerticalContainer"><a class="GoUp" href=""><div><i></i></div></a><div class="ListVertical">' + Playlist.join('') + '</div><a class="GoDown" href=""><div><i></i></div></a></div>');
        HTML.push('<div class="StageContainer"><div class="Stage"></div></div>');
        HTML.push('<a class="GoLeft" href=""><div><i></i></div></a>');
        HTML.push('<a class="GoRight" href=""><div><i></i></div></a>');
        HTML.push('<div class="ListHorizontalContainer"><div class="ListHorizontal">' + Playlist.join('') + '</div></div>');
        Target.html(HTML.join(''));
        Target.find('a').unbind('click').bind('click', function (event) {
            event.preventDefault();
            _PlayerLoadVideo(Target, $(this).data('id'));
        });
        $(window).resize(function () {
            _PlayerResponsive(Target);
        });
        $(window).on('orientationchange', function () {
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
        Target.find('.StageContainer').css('margin-right', '200px');
        Target.find('.ListHorizontalContainer, .GoLeft, .GoRight').hide();
        Target.find('.ListVerticalContainer').show();
        setTimeout(function () {
            Target.find('.ListVertical').height(Target.find('.StageContainer').height() - 60);
            if ((Target.find('.ListVertical').find('a').first().height() * Target.find('.ListVertical').find('a').length) < Target.find('.ListVertical').height()) {
                Target.find('.GoUp, .GoDown').hide();
            } else {
                Target.find('.GoUp, .GoDown').show();
            }
        }, 100);

    } else {
        Target.find('.StageContainer').css('margin-right', '0px');
        Target.find('.ListHorizontalContainer, .GoLeft, .GoRight').show();
        Target.find('.ListVerticalContainer').hide();

        if ((Target.find('.ListHorizontal').find('a').first().width() * Target.find('.ListHorizontal').find('a').length) < Target.find('.ListHorizontal').width()) {
            Target.find('.GoLeft, .GoRight').hide();
        } else {
            Target.find('.GoLeft, .GoRight').show();
        }
    }
    Target.find('.GoUp').unbind('click').bind('click', function (event) {
        event.preventDefault();
        Target.find('.ListVertical').stop().animate({ scrollTop: '-=' + (Target.find('.StageContainer').height() * 0.75) }, 750);
    });
    Target.find('.GoDown').unbind('click').bind('click', function (event) {
        event.preventDefault();
        Target.find('.ListVertical').stop().animate({ scrollTop: '+=' + (Target.find('.StageContainer').height() * 0.75) }, 750);
    });
    Target.find('.GoLeft').unbind('click').bind('click', function (event) {
        event.preventDefault();
        Target.find('.ListHorizontalContainer').stop().animate({ scrollLeft: '-=' + (Target.find('.StageContainer').width() * 0.75) }, 750);
    });
    Target.find('.GoRight').unbind('click').bind('click', function (event) {
        event.preventDefault();
        Target.find('.ListHorizontalContainer').stop().animate({ scrollLeft: '+=' + (Target.find('.StageContainer').width() * 0.75) }, 750);
    });
}
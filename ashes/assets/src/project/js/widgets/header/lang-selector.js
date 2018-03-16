function openLink(culture) {
    var url = $('[data-sf-role="' + culture + '"]').val();
    window.location = url;
}

//below is for IS application setting cookie
function initiateLangSelectorForIS() {
    var langCookie = 'MCHP=';
    var currentSavedLang;
    var cookies = document.cookie.split(';');
    var selectedLanguage = $('.language').find(':selected').text();
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(langCookie) === 0) {
            var langTaken = c.substring(langCookie.length, c.length);
        }
    }

    if (langTaken === 'Style=jp') {
        currentSavedLang = 'Japanese';
        $('.language').empty();
        $('.language').append('<option>Japanese</option><option>Chinese</option><option>English</option>');
    } else if (langTaken === 'Style=cn') {
        currentSavedLang = 'Chinese';
        $('.language').empty();
        $('.language').append('<option>Chinese</option><option>English</option><option>Japanese</option>');
    } else if (langTaken === 'Style=en') {
        currentSavedLang = 'English';
        $('.language').empty();
        $('.language').append('<option>English</option><option>Japanese</option><option>Chinese</option>');
    } else {
        $('.language').empty();
        $('.language').append('<option>English</option><option>Japanese</option><option>Chinese</option>');
    }

    $('.language').change(function () {
        var currentLocation = window.location.pathname + window.location.search;

        var redirectPage = currentLocation;

        selectedLanguage = $('.language').find(':selected').text();

        if (selectedLanguage === 'Japanese') {
            document.cookie = 'MCHP=Style=jp; expires=31 Dec 9999 12:00:00 UTC; path=/';
            document.cookie = 'CurrentLanguage=jp; expires=31 Dec 9999 12:00:00 UTC; path=/';
            location.href = currentLocation;

        } else if (selectedLanguage === 'Chinese') {
            document.cookie = 'MCHP=Style=cn; expires=31 Dec 9999 12:00:00 UTC; path=/';
            document.cookie = 'CurrentLanguage=cn; expires=31 Dec 9999 12:00:00 UTC; path=/';
            location.href = currentLocation;

        } else if (selectedLanguage === 'English') {
            document.cookie = 'MCHP=Style=en; expires=31 Dec 9999 12:00:00 UTC; path=/';
            document.cookie = 'CurrentLanguage=en; expires=31 Dec 9999 12:00:00 UTC; path=/';
            location.href = currentLocation;
        }
    });
}
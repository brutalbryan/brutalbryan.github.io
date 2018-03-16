
$(document).ready(function () {
    $("#ImagelistItem a").each(function (i) {
        if (!this.href || this.href == window.location.href) {
            $(this).attr("onclick", "return false;");
        }
    });
    var list = document.getElementById('Imagelist').getElementsByTagName("li");

    if (list.length < 3) {
        document.getElementById('hide').style.display = 'none';
        document.getElementById('show').style.display = 'none';
        if (list.length == 0) {
            document.getElementById('pressGraphics').style.display = 'none';
        }
    } else if (list.length > 3) {
        mchpPR_Hide();
    }

    $("#Body_ctl00_ctl00_ctl00_divPressRelease ul").addClass("prepend-top bulletList");
    $("#Imagelist").removeClass("prepend-top bulletList");
});


function mchpPR_ShowMore() {
    var list = document.getElementById('Imagelist').getElementsByTagName("li");

    for (var i = 0; i < list.length; i++) {
        if (i >= 3) {
            list[i].style.display = 'block';
        }
        if (i >= 7) {
            list[i].style.display = 'none';
        }

    }

    document.getElementById('hide').style.display = 'inline';
    document.getElementById('show').style.display = 'none';
}

function mchpPR_Hide() {
    var list = document.getElementById('Imagelist').getElementsByTagName("li");
    for (var i = 0; i < list.length; i++) {
        if (i >= 3) {
            list[i].style.display = 'none';
        }
    }

    document.getElementById('hide').style.display = 'none';
    if (document.getElementById('show') != null)
        document.getElementById('show').style.display = 'inline';
}

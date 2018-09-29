countries = ["unknown", "Australia", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "China - Hong Kong / Macau", "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of (DRC)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "French Guiana", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Great Britain", "Greece", "Grenada", "Guadeloupe", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Israel and the Occupied Territories", "Italy", "Ivory Coast (Cote d'Ivoire)", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, Democratic Republic of (North Korea)", "Korea, Republic of (South Korea)", "Kosovo", "Kuwait", "Kyrgyz Republic (Kyrgyzstan)", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia, Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar/Burma", "Namibia", "Nepal", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pacific Islands", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic (Slovakia)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Netherlands", "Timor Leste", "Togo", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United States of America (USA)", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (UK)", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"]
images = [];
currentimage = 0;

function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function swipedetect(el, callback) {
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {};
    $(document).on('touchstart', el, function (e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
    $(document).on('touchmove', el, function (e) {
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
    $(document).on('touchend', el, function (e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}
$(function () {
    countries.forEach(element => {
        $(".country").append("<option value='" + element + "'>" + element + "</option>")
    });
    [...Array(218).keys()].forEach(element => {
        $(".year").append("<option value='" + (element + 1800) + "'>" + (element + 1800) + "</option>")
    });
    [...Array(400).keys()].forEach(element => {
        $(".value").append("<option value='" + (element * 5) + "'>$" + toCommas(element * 5) + "</option>")
    });
    $.cookie("test", 1);
    $('.coin').selectize({
        create: true,
        sortField: 'text'
    });
    $('.country').selectize({
        create: false,
    });
    $('.year').selectize({
        create: true,
        sortField: 'text'
    });
    value = $('.value').selectize({
        create: true,
        onType: function (input) {
            console.log(input)
            if (input.charAt(0) != "$") $(this)[0].setTextboxValue("$" + input.replace(/\D/g, ''))
        }
    });
    $("#InputCamera").on("change", function (e) {
        var file = e.originalEvent.srcElement.files[0];
        var reader = new FileReader();
        var img = $("<img/>")
        img.css({
            width: "70px",
        });
        reader.onloadend = function () {
            img.attr("src", reader.result);
        }
        reader.readAsDataURL(file);
        $(".images").prepend(img)
    });
    getcoins();
});
$(document).on("click", ".coin", function () {
    $(this).focus(function () {
        var $this = $(this);
        $this.select();
        $this.mouseup(function () {
            $this.unbind("mouseup");
            return false;
        });
    });
});

function validate() {
    srcs = $(".images img").map(x => $(".images img").eq(x).attr("src"))
    console.log(typeof (srcs))
    setTimeout(function () {
        $.post("/add", {
            coin: $('.coin').val(),
            country: $(".country").val(),
            year: $(".year").val(),
            value: $(".value").val(),
            notes: $(".notes").val(),
            images: JSON.stringify(srcs)
        }, function (msg) {
            if (JSON.parse(msg).code == 1) {
                $("#button").removeClass("onclic");
                $("#button").addClass("validate", 450, callback());
            } else alert("Server error " + msg)
        });
    }, 1000);
}
$(document).on("click", ".tablesorter tr", function () {
    that = $(this)
    view = $("#imageviewer")
    view.find("img").attr("src", "/static/img/coins.png")
    $.ajax({
        dataType: "json",
        url: "/single/" + that.find(".rem").attr("data-id"),
        success: function (data) {
            images = JSON.parse(data.images)
            dis = images.length <= 1 ? "none" : "block"
            view.find(".left").css("display", dis)
            view.find(".right").css("display", dis)
            view.find("img").attr("src", images[0])
            $("#imageviewer").css("display", "flex").hide().fadeIn();
        }
    });
})
$(document).on("click", "#imageviewer .exit", function () {
    $("#imageviewer").fadeOut();
});

function right() {
    if (images.length == 0) return
    if (currentimage == images.length - 1) currentimage = 0;
    else currentimage++;
    $("#imageviewer").find("img").attr("src", images[currentimage])
}

function left() {
    if (images.length - 1 == 0) return
    else if (currentimage - 1 < 0) currentimage = images.length - 1;
    else currentimage--;
    $("#imageviewer").find("img").attr("src", images[currentimage])
}
swipedetect("imageviewer", function (swipedir) {
    console.log(swipedir)
    if (swipedir == "left") left();
    else if (swipedir == "right") right();
});
$(document).on("click", "#imageviewer .left", function () { left() });
$(document).on("click", "#imageviewer .right", function () { right() });

function callback() {
    setTimeout(function () {
        $("#button").removeClass("validate");
    }, 1250);
    window.location.reload(true);
}
$(document).on("click", "#button", function () {
    $("#button").addClass("onclic", 250, validate());
});
$(document).on("click", ".ImageAdd", function () {
    $("#InputCamera").click()
});
$(document).on("click", ".images img", function (e) {
    $(this).remove();
});
$(document).on("click", ".addclick", function () {
    $(".ListContainer").fadeOut(function () {
        $(".AddContainer").fadeIn();
    });
});
$(document).on("click", ".listclick", function () {
    $(".AddContainer").fadeOut(function () {
        $(".ListContainer").fadeIn();
    });
})

function getcoins() {
    $.ajax({
        dataType: "json",
        url: "/all",
        success: function (data) {
            data.forEach(element => {
                $(".tablesorter tbody").append("<tr>\
                    <td class='rem' style='width:20px' data-id='" + element.id + "'><a  style='color:red'>x</a></td>\
                    <td>" + element.type + "</td>\
                    <td>" + element.year + "</td>\
                    <td>$" + element.value + "</td>\
                </tr>")
                console.log(element)
            })
            $("#tablesorter").tablesorter({
                headers: {
                    0: { sorter: false }
                }
            });
        }
    });
}
$(document).on("click touchstart", ".rem", function () {
    that = $(this)
    $.post("/remove", {
        id: that.attr("data-id")
    }, function (msg) {
        if (JSON.parse(msg).code == 1) {
            console.log(that.data("id"))
            that.parent().remove()
            $(this).closest("tr").remove();
        } else alert("Server error " + msg)
    });
})

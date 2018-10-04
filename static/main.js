countries = ["unknown", "Australia", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "China - Hong Kong / Macau", "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of (DRC)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "French Guiana", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Great Britain", "Greece", "Grenada", "Guadeloupe", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Israel and the Occupied Territories", "Italy", "Ivory Coast (Cote d'Ivoire)", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, Democratic Republic of (North Korea)", "Korea, Republic of (South Korea)", "Kosovo", "Kuwait", "Kyrgyz Republic (Kyrgyzstan)", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia, Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar/Burma", "Namibia", "Nepal", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pacific Islands", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic (Slovakia)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Netherlands", "Timor Leste", "Togo", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United States of America (USA)", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (UK)", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"]

function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
$.fn.isBound = function (type, fn) {
    var data = this.data('events')[type];
    if (data === undefined || data.length === 0) {
        return false;
    }
    return (-1 !== $.inArray(fn, data));
};
class Myimage {
    constructor(id, max = 0) {
        this.current = 0;
        this.max = max;
        this.id = id;
        this.dis = this.max <= 1 ? "none" : "block";
        this.setup()
        that = this
            // $("#imageviewer .left").onclick = this.previous()
            // $(document).on("swipeleft", ".mainimg", function (e) { this.previous(); });
            // $(document).on("swiperight", ".mainimg", function (e) { this.next(); });
            // $(document).on("click", "#imageviewer .left", function (e) { this.previous(); });
            // $(document).on("click", "#imageviewer .right", function (e) { this.next(); });
    }
    update(id, max) {
        this.id = id;
        this.max = max;
        this.setup();
    }
    setup() {
        console.log(this.max)
        console.log(this.id)
        this.dis = this.max <= 1 ? "none" : "block";
        $("#imageviewer").find(".left").css("display", this.dis);
        $("#imageviewer").find(".right").css("display", this.dis);
        if (this.max == 0) this.change("/static/img/coins.png");
        else this.change("/static/coins/" + this.id + "/" + this.current + ".png")
    }
    change(url) {
        $("#imageviewer").find(".mainimg").attr("src", url)
    }
    previous() {
        if (this.max - 1 == 0) return
        else if (this.current - 1 < 0) this.current = this.max - 1;
        else this.current--;
        this.change("/static/coins/" + this.id + "/" + this.current + ".png")
    }
    next() {
        console.log(this)
        if (this.max == 0) return
        if (this.current == this.max - 1) this.current = 0;
        else this.current++;
        this.change("/static/coins/" + this.id + "/" + this.current + ".png")
    }
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
    srcs = $(".images img").map(x => $(".images img").eq(x).attr("src").split(",")[1]).get()
    data = {
        coin: $('.coin').val(),
        country: $(".country").val(),
        year: $(".year").val(),
        value: $(".value").val(),
        notes: $(".notes").val(),
        images: srcs
    }
    setTimeout(function () {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/add',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (result) {
                console.log()
                if (result.code == 1) {
                    $("#button").removeClass("onclic");
                    $("#button").addClass("validate", 450, callback());
                } else alert("Server error " + result)
            },
            error: function (result) {
                console.log(result);
            }
        });
    }, 1000);
}
$(document).on("click", ".tablesorter td", function () {
    $(this).parent().addClass("active")
    that = $(this)
    if (that.hasClass("rem")) {
        $.post("/remove", {
            id: that.attr("data-id")
        }, function (msg) {
            if (JSON.parse(msg).code == 1) {
                console.log(that.data("id"))
                that.parent().find("td").toggle(function () {
                    that.parent().fadeOut().remove();
                });
            } else alert("Server error " + msg)
        });
        return
    }
    view = $("#imageviewer");
    view.find(".mainimg").attr("src", "/static/img/loading.gif");
    $("#imageviewer").css("display", "flex").hide().fadeIn();
    d = $(".active").find(".rem").attr("data-id")
    x = parseInt($(".active").find(".rem").attr("data-images"))
    i = new Myimage(d, x)
    $(document).off('click', '#imageviewer .left');
    $(document).off('swiperight', '#imageviewer .mainimg');
    $(document).off('click', '#imageviewer .right');
    $(document).off('swipeleft', '#imageviewer .mainimg');
    $(document).on("click", "#imageviewer .left", function () { i.previous() })
    $(document).on("swiperight", "#imageviewer .mainimg", function () { i.previous() })
    $(document).on("click", "#imageviewer .right", function () { i.next() })
    $(document).on("swipeleft", "#imageviewer .mainimg", function () { i.next() })
});
$(document).on("click touchstart", "#imageviewer .exit", function (e) {
    $(".active").attr("class", "")
    $("#imageviewer").fadeOut();
});

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
                console.log(element)
                $(".tablesorter tbody").append("<tr>\
                    <td class='rem' style='width:20px' data-id='" + element.id + "' data-images='" + element.images + "'><a  style='color:red'>x</a></td>\
                    <td>" + element.type + "</td>\
                    <td>" + element.year + "</td>\
                    <td>$" + element.value + "</td>\
                </tr>")
                    // console.log(element)
            })
            $(".loader").fadeOut();
            $("#tablesorter").tablesorter({
                headers: {
                    0: { sorter: false }
                }
            });
        }
    });
}

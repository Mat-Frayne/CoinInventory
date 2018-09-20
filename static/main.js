countries = ["unknown", "Australia", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "China - Hong Kong / Macau", "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of (DRC)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "French Guiana", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Great Britain", "Greece", "Grenada", "Guadeloupe", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Israel and the Occupied Territories", "Italy", "Ivory Coast (Cote d'Ivoire)", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, Democratic Republic of (North Korea)", "Korea, Republic of (South Korea)", "Kosovo", "Kuwait", "Kyrgyz Republic (Kyrgyzstan)", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia, Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar/Burma", "Namibia", "Nepal", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pacific Islands", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic (Slovakia)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Netherlands", "Timor Leste", "Togo", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United States of America (USA)", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (UK)", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"]

function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    console.log("Ready")
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
    $(".listclick").click();
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
})
$(document).on("click", ".images img", function (e) {
    $(this).remove();
});
$(document).on("click", ".addclick", function () {
    $(".ListContainer").fadeOut(function () {
        $(".AddContainer").fadeIn();
    });
})
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
    // $.get("/all", function (data, textStatus, jqXHR) {
    //     data.forEach(element => {
    //         $(".tablesorter").append("<tr>\
    //                     <td style='width:20px' ><a style='color:red'>x</a></td>\
    //                     <td>" + element.type + "</td>\
    //                     <td>" + element.year + "</td>\
    //                     <td>$" + element.value + "</td>\
    //                 </tr>")
    //         console.log(element)
    //     })
    // }, "json");
}
$(document).on("click", ".rem", function () {
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

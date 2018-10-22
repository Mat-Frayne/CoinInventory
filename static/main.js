countries = ["unknown", "Australia", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "China - Hong Kong / Macau", "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of (DRC)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "French Guiana", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Great Britain", "Greece", "Grenada", "Guadeloupe", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Israel and the Occupied Territories", "Italy", "Ivory Coast (Cote d'Ivoire)", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Korea, Democratic Republic of (North Korea)", "Korea, Republic of (South Korea)", "Kosovo", "Kuwait", "Kyrgyz Republic (Kyrgyzstan)", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia, Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar/Burma", "Namibia", "Nepal", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pacific Islands", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovak Republic (Slovakia)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Netherlands", "Timor Leste", "Togo", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos Islands", "Uganda", "Ukraine", "United Arab Emirates", "United States of America (USA)", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (UK)", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"]
function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
class Myimage {
    constructor(id, max = 0) {
        this.current = 0;
        this.max = max;
        this.id = id;
        this.dis = this.max <= 1 ? "none" : "block";
        this.setup()
        that = this
    }
    update(id, max) {
        this.id = id;
        this.max = max;
        this.setup();
        
    }
    dots(){
        $(".imagedots").empty();
        var circle;
        for(x =0; x < this.max; x++){
            if(x == this.current)
                circle = makeSVG('circle', {cx: (($(".imagedots").width()/this.max)-10)+ x*20, cy: 20, r:5, stroke: '#50aadf', 'stroke-width': 3, fill: '#50aadf'});
            else
            circle = makeSVG('circle', {cx: (($(".imagedots").width()/this.max)-10)+ x*20, cy: 20, r:5, stroke: '#50aadf', 'stroke-width': 3, fill: 'transparent'});
            $(".imagedots").append(circle)
        }
    }
    setup() {

        this.dis = this.max <= 1 ? "hidden" : "visible";
        $("#imageviewer").find(".left").css("visibility", this.dis);
        $("#imageviewer").find(".right").css("visibility", this.dis);
        if (this.max == 0) this.change("/static/img/coins.png");
        else this.change("/static/coins/" + this.id + "/" + this.current + ".png")
        this.dots();
        
    }
    change(url) {
        $("#imageviewer").find(".mainimg").attr("src", url);
        this.dots();

    }
    previous() {
        if (this.max - 1 == 0) return
        else if (this.current - 1 < 0) this.current = this.max - 1;
        else this.current--;
        this.change("/static/coins/" + this.id + "/" + this.current + ".png")
        
    }
    next() {
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
        $(".value").append("<option value='" + (element * 5) + "'>" + toCommas(element * 5) + "</option>")
    });
    $.cookie("test", 1);
    $('.coin').selectize({
        create: true,
        sortField: 'text',
        createOnBlur: true
    });
    $('.country').selectize({
        create: true,

        createOnBlur: true
    });
    $('.year').selectize({
        create: true,
        sortField: 'text',
        createOnBlur: true
    });
    value = $('.value').selectize({
        create: true,
        createOnBlur: true
        // initialize: $(".value .item inout").css("padding-right", "15px")
        
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
    // $(".listclick").click();
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
                if (result.code == 1) {
                    $("#button").removeClass("onclic");
                    $(".onclic").removeClass("onclic");
                    $("#button").addClass("validate", 450, callback());
                    $(".validate").addClass("validate", 450, callback());
                } else alert("Server error " + result)
            },
            error: function (result) {
                console.log(result);
            }
        });
    }, 1000);
}



function save() {
    data = {
        type: $('[name="TypeEdit"]').val(),
        country: $('[name="CountryEdit"]').val(),
        year: $('[name="YearEdit"]').val(),
        value: $('[name="ValueEdit"]').val(),
        notes: $('[name="NotesEdit"]').val(),
        id: $(".active").find(".rem").attr("data-id")
    }
    setTimeout(function () {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/edit',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (result) {
                if (result.code == 1) {
                    $(".save").removeClass("onclic");
                    $(".onclic").removeClass("onclic");
                    $(".save").addClass("validate", 450, savecallback());
                    $(".validate").addClass("validate", 450, savecallback());
                    $(".active td").eq(1).text(data.type)
                    $(".active td").eq(2).text(data.country)
                    $(".active td").eq(3).text(data.year)
                    $(".active td").eq(4).text("$" + data.value)
                    $(".tablesorter tr").attr("class","")

                } else {
                    alert("Server error " + result.toString())
                    console.log(result)
                    $(".tablesorter tr").attr("class","")

                }
            },
            error: function (result) {
                console.log(result);
                $(".tablesorter tr").attr("class","")

            }
        });
    }, 1000);
}
function savecallback(){
    setTimeout(function () {
        $("#button").removeClass("validate");
        $(".save").removeClass("validate");
    }, 1250);
    $("#CoinViewer").fadeOut()
}
$(document).on("click", ".tablesorter td", function () {
    $(this).parent().addClass("active")
    that = $(this)
    if (that.hasClass("rem")) {
        $.post("/remove", {
            id: that.attr("data-id")
        }, function (msg) {
            if (JSON.parse(msg).code == 1) {
                that.parent().find("td").toggle(function () {
                    that.parent().fadeOut().remove();
                });
            } else alert("Server error " + msg)
        });
        return
    }
    view = $("#imageviewer");
    view.find(".mainimg").attr("src", "/static/img/loading.gif");
    $("#CoinViewer").css("display", "flex").hide().fadeIn();
    d = $(".active").find(".rem").attr("data-id")
    x = parseInt($(".active").find(".rem").attr("data-images"))
    i = new Myimage(d, x)
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: '/single/' + i.id,
        success: function (result) {
            try{
                $("#info input").val('')

                
                $("[name='TypeEdit']").val(result.type)
                $("[name='CountryEdit']").val(result.country)
                $("[name='YearEdit']").val(result.year)
                $("[name='ValueEdit']").val(result.value)
                $("[name='NotesEdit']").text(result.notes == null ? "" : result.notes)
                
               
                $(document).off('click', '#imageviewer .left');
                $(document).off('swiperight', '#imageviewer .mainimg');
                $(document).off('click', '#imageviewer .right');
                $(document).off('swipeleft', '#imageviewer .mainimg');
                $(document).on("click", "#imageviewer .left", function () { i.previous() })
                $(document).on("swiperight", "#imageviewer .mainimg", function () { i.previous() })
                $(document).on("click", "#imageviewer .right", function () { i.next() })
                $(document).on("swipeleft", "#imageviewer .mainimg", function () { i.next() })
        }catch(result){
            alert(result)
        }
    },
        error: function (result) {
            console.log(result);
        }
    });
});
$(document).on("click touchstart", "#imageviewer .exit", function (e) {
    $(".active").attr("class", "")
    $("#CoinViewer").fadeOut(function () {
        $("#imageviewer").find(".mainimg").attr("src", "/static/img/loading.gif");
    });
});

function callback() {
    setTimeout(function () {
        $("#button").removeClass("validate");
        $(".save").removeClass("validate");
    }, 1250);
    window.location.reload(true);
}
$(document).on("click", "#button", function () {
    $("#button").addClass("onclic", 250, validate());
});
$(document).on("click", ".save", function () {
    $(".save").addClass("onclic", 250, save());
    

});

$(document).on("click", ".cancel", function(){
    $(".tablesorter tr").attr("class","")
    $("#CoinViewer").fadeOut()
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
$(document).on("focus click touchstart", "#info input", function(e){
    $(this).get(0).setSelectionRange(0,9999);
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
                    <td>" + element.country + "</td>\
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

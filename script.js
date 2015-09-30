var fish_links = [
    "http://images.clipartpanda.com/free-fish-clipart-happy_gold_fish.png",
    "http://cliparts.co/cliparts/BTg/K4g/BTgK4gbac.png",
    "http://images.clipartpanda.com/fish-clipart-jcxyp4kcE.png",
    "http://www.clker.com/cliparts/C/q/7/m/D/t/purple-fish-md.png",
    "http://www.clipartbest.com/cliparts/LiK/d79/LiKd79G6T.png",
    "http://cliparts.co/cliparts/6ir/6KG/6ir6KGe5T.png",
    "http://images.clipshrine.com/download/wheel/large-striped-tropical-fish-33.3-8332.png",
    "http://images.clipartpanda.com/clipart-fish-11954413101184310947johnny_automatic_tropical_fish.svg.med.png",
    "http://images.clipartpanda.com/tropical-fish-clipart-acqejaXoi.png",
    "http://images.clipartpanda.com/fish-clip-art-LiKX7y4ia.png",
    "http://images.clipartpanda.com/type-clipart-butterflyfish.png",
    "http://www.clipartqueen.com/image-files/yellow-orange-fish.png",
    "http://fish-clipart.com/img/betta002.png",
    "http://www.playcast.ru/uploads/2015/03/14/12638975.png",
    "http://clipart-finder.com/data/preview/danz_Flowerhorn_Fish_2.png",
    "http://rickmeurs.com/wp-content/uploads/2012/09/fish2.png",
    "http://oncry.com/fish-clipart-9.html",
];

var duck = $('#duck').data('ratio', 1).data('count', 0);
var count = 0;

function rotate_duck(rad) {
    duck.css({transform: 'rotate(' + rad + 'rad)'});
}

function resize_elem_abs(elem, width, height)    {
    elem.css({width: width + 'px', height: height + 'px', 'z-index': parseInt((width + height) / 2, 10) + 50});
}

function get_elem_width(elem) {
    if (elem.outerWidth() >= elem.outerHeight())
        return elem.outerWidth();
    return elem.outerHeight();
}

function resize_elem(elem, width, ratio) {
    if (ratio >= 1)
        resize_elem_abs(elem, width, width / ratio);
    else resize_elem_abs(elem, width * ratio, width);
    if (elem == duck)
        $('#score').text("Score: " + duck.outerWidth());
}

function calc_dist(dx, dy) {
    xd2 = Math.pow(dx, 2);
    yd2 = Math.pow(dy, 2);
    return Math.sqrt(xd2 + yd2);
}

function get_duck_speed() {
    return duck.outerWidth() / 10.0;
}

function get_fish_speed(fish) {
    return (fish.outerWidth() + fish.outerHeight()) / 2.0;
}

function eat_elem(hunter, prey)    {
    resize_elem(hunter, Math.sqrt(Math.pow(get_elem_width(hunter), 2) + Math.pow(get_elem_width(prey), 2)), hunter.data('ratio'));
    if (prey == duck)    {
        console.log('heya');
        prey.hide();
        alert("Game Over!!!, Your Score: " + prey.outerWidth() + "!!!");
        $('.fish').remove();
        resize_elem(duck, 25, duck.data('ratio'));
        prey.show();
    }
    else prey.remove();
}

function can_eat(hunter, prey)    {
    return hunter.outerWidth() >= prey.outerWidth() * 1.1 && hunter.outerHeight() >= prey.outerHeight() * 1.1;
}

function elemOverlap(elema, elemb){
    
    var offseta = elema.offset();
    var offsetb = elemb.offset();
    
    var al = offseta.left;
    var ar = al + elema.outerWidth();
    var bl = offsetb.left;
    var br = bl + elemb.outerWidth();

    var at = offseta.top;
    var ab = at + elema.outerHeight();
    var bt = offsetb.top;
    var bb = bt + elemb.outerHeight();
    
    if(bl>ar || br<al){return false;}//overlap not possible
    if(bt>ab || bb<at){return false;}//overlap not possible

    if(bl>al && bl<ar){return true;}
    if(br>al && br<ar){return true;}

    if(bt>at && bt<ab){return true;}
    if(bb>at && bb<ab){return true;}

    return false;
}

function move_elem(elem, x, y, distance, speed, callback)    {
    elem.clearQueue();
    elem.animate(
        {left: x + 'px', top: y + 'px'},
        {duration: distance * speed, easing: "linear", complete: function() {
            elem.css({left: x + 'px', right: y + 'px'});
            if (callback)
                callback(elem);
        }, step: function() {
            elem.siblings('img').each(function() {
                if (elemOverlap(elem, $(this)))
                    if (can_eat(elem, $(this)))
                        eat_elem(elem, $(this));
                    else if (can_eat($(this), elem))
                        eat_elem($(this), elem);
            });
            elem.data('count', elem.data('count') + 1);
            if (elem.data('count') % 10 == 0)
                if (elem == duck)
                    resize_elem(elem, get_elem_width(elem) * 0.999, elem.data('ratio'));
                else resize_elem(elem, get_elem_width(elem) * 0.9999, elem.data('ratio'));
        }
    });    
}

function move_duck(x, y)    {
    x -= duck.outerWidth() / 2.0;
    y -= duck.outerHeight() / 2.0;
    var offset = duck.offset();
    var dx = x - offset.left;
    var dy = y - offset.top;
    rotate_duck(Math.atan2(dy, dx));
    count++;
    if (count % 5 === 0)
        move_elem(duck, x, y, calc_dist(dx, dy), get_duck_speed());
}

function move_fish(fish) {
    var dx = -3 * fish.outerWidth() + 6 * fish.outerWidth() * Math.random();
    var dy = -3 * fish.outerHeight() + 6 * fish.outerHeight() * Math.random();
    var offset = fish.offset();
    var x = offset.left + dx;
    var y = offset.top + dy;
    if (x < 0)
        x = 0;
    else if (x > $(window).outerWidth() - fish.outerWidth())
        x = $(window).outerWidth() - fish.outerWidth();
    
    if (y < 0)
        y = 0;
    else if (y > $(window).outerHeight() - fish.outerHeight())
        y = $(window).outerHeight() - fish.outerHeight();
    move_elem(fish, x, y, calc_dist(dx, dy), get_fish_speed(fish), move_fish);
}

function add_fish() {
    $('<img class="fish"></img>').attr('src', fish_links[(Math.random() * fish_links.length) | 0]).load(function() {
        var ratio = this.width * 1.0 / this.height;
        $(this).data('ratio', ratio).data('count', 0);
        resize_elem($(this), duck.outerWidth() / 4.0 + duck.outerWidth() * Math.random(), ratio);
        $(this).css({left: Math.random() * ($(window).outerWidth() - $(this).outerWidth()), top: Math.random() * ($(window).outerHeight() - $(this).outerHeight())});
        var conflict = false;
        var thi = $(this)
        thi.siblings().each(function() {
            if (conflict)
                return;
            if (elemOverlap(thi, $(this)))
                conflict = true;
        });
        if (conflict)
            $(this).remove();
        else {
            $(this).appendTo('body');
            move_fish($(this));
        }
    });
    setTimeout(add_fish, 1000 + Math.random() * 3000);
}

$(document).ready(function() {
    add_fish();
    
    $(window).mousemove(function(evt) { move_duck(evt.pageX, evt.pageY);});
});

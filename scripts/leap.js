var selected = 2

var cats = {};
var options = { enableGestures: true };
var last_rotate = 0;
var reset = 1;
var rotation = 0;

Leap.loop(options,function (frame) {
    frame.hands.forEach(function (hand, index) {
        var cat = cats[index] || (cats[index] = new Cat(selected));

        if (hand.pinchStrength>0.9 && hand.grabStrength<0.2) {
            // replace this code by whatever cat that is picked up
            if (reset==1) {
                //selected += 1;
                if (selected>4) {
                    selected = 1;
                }
                document.getElementById("Cat").src='images/images'+selected+'.jpg';
                cat.setTransform(hand.screenPosition(), last_rotate);
                //
                reset = 0;
            }
        } else {
            reset = 1;
        }
        
        if (hand.grabStrength<0.8) {
            cat.setTransform(hand.screenPosition(), rotation);
        } else {
            roll = hand.roll();
            if (roll>0.15 || roll<0.15) {
                rotation = roll;
                cat.setTransform(hand.screenPosition(), rotation);
            }
        }
    });
}).use('screenPosition', { scale: 0.25 });



var Cat = function (imgNo) {
    var cat = this;
    var img = document.createElement('img');
    img.id = "Cat"
    img.src = 'images/images'+imgNo+'.jpg';
    img.style.position = 'absolute';

    img.onload = function () {
        cat.setTransform([
            window.innerWidth / 2,
            window.innerHeight / 2
        ], 0);
        document.body.appendChild(img);
    };
    
    cat.setTransform = function (position, rotation) {

        img.style.left = position[0] - img.width / 2 + 'px';
        img.style.top = position[1] - img.height / 2 + 'px';
        img.style.transform = 'rotate(' + -rotation + 'rad)';
        img.style.webkitTransform = img.style.MozTransform = img.style.msTransform = img.style.OTransform = img.style.transform;

    };
    
    
    
};

cats[0] = new Cat(selected);

Leap.loopController.setBackground(true);

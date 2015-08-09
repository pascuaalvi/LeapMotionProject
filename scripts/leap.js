var imgno = 2;
$ = jQuery;

var images = {};
var options = { enableGestures: true };
var last_rotate = 0;
var reset = 1;
var rotation = 0;

Leap.loop(options,function (frame) {
    frame.hands.forEach(function (hand, index) {
        var images = images[index] || (images[index] = new Image(selected));

        if (hand.grabStrength>0.7) {
            // replace this code by whatever image that is picked up
           if (reset==1) {
                document.getElementById("Image").src='images/images'+imgno+'.jpg';
                image.setTransform(hand.screenPosition(), last_rotate);
                reset = 0;
           }
        } else {
            reset = 1;
            document.getElementById("Image").src='images/circle.png';
            image.setTransform(hand.screenPosition(), last_rotate);
        }
        
        if (hand.grabStrength<0.8) {
            image.setTransform(hand.screenPosition(), rotation);
        } else {
            roll = hand.roll();
            if (roll>0.15 || roll<0.15) {
                rotation = roll;
                image.setTransform(hand.screenPosition(), rotation);
            }
        }
    });
    // Grab an Image
    frame.gestures.forEach(function(gesture){
      if (gesture.type === circle){
        var image = grabbedHands[gesture.handIds[0]];
        if (image == null){
          //ignore
        } else {
          // apply image scaling
        }
      }
    });
}).use('screenPosition', { scale: 1 });

var Image = function(imgNo) {
  var image = this;
  var img = document.createElement('img');
  img.id = "Image"+imgNo;
  img.src = 'images/images'+imgNo+'.jpg';
  img.style.position = 'inline-block';
  img.style.width = '200px';
  img.style.height = '25%';
  img.onload = function () {
    //image.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    //document.body.appendChild(img);
    $("#thumbnail").append(img);
  }

  image.setAsCurrentImage = function(){
    $("#thumbnail img").removeClass("selected");
    img.classList.add("selected");
  }
  
  image.setTransform = function(position, rotation) {
    if($(this).hasClass("selected")){
      console.log(position+" X "+rotation);
      img.style.left = position[0] - img.width  / 2 + 'px';
      img.style.top  = position[1] - img.height / 2 + 'px';

      img.style.transform = 'rotate(' + -rotation + 'rad)';
      
      img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
      img.style.OTransform = img.style.transform;
    }
  };   
};

for(var i = 0 ; i < 5 ; i++){
  images[i] = new Image(i+1);
}

Leap.loopController.setBackground(true);

var imgno = 2;
$ = jQuery;

var images = [];
var canvasImages = [];
var grabbedHands = {} // hand id -> Image, or [hand id] is holding [Image]

var options = {
    enableGestures: true
};
var last_rotate = 0;
var reset = 1;
var rotation = 0;

var riggedHandPlugin;

Leap.loop({
  hand: function(hand){
      var handMesh = hand.data('riggedHand.mesh');
      var handScale = 0.2;
      handMesh.scale = new THREE.Vector3(handScale, handScale, handScale);
      var screenPosition = handMesh.screenPosition(
        hand.palmPosition,
        riggedHandPlugin.camera
      );

      // if hand is grabbed
      if (hand.grabStrength > 0.7) {
          //// if hand id is in grabbedHands
          if (hand.id in grabbedHands) {
              ////// apply transformation to image
              if (grabbedHands[hand.id] == null){
                return;
              } else {
                grabbedHands[hand.id].setTransform(hand.screenPosition(), last_rotate);
              }
          } else {
              //// else
              var image = grabImage(screenPosition);

              if (image == null) {
                  //if hand is freshly grabbed without finding an image
                  grabbedHands[hand.id] = null;
                  return;
              }

              ////// find if image is already grabbed
              for (key in grabbedHands) {
                  if (key == hand.id()) {
                      console.log('Error, hand (' + hand.id + ') should not be in grabbedHands')
                      continue;
                  } else if (grabbedHands[key] == image) {
                    grabbedHands[hand.id()] = null;
                    return;
                      ////// if image is already grabbed, return because we cant grab again
                  }
              }

              grabbedHands[hand.id] = image;
              ////// put image into grabbedHands
              // document.getElementById("Image").src='images/images'+imgno+'.jpg';
              //console.log(hand);
              image.setTransform(hand.screenPosition(), hand.rotation);
              // apply transformations
          }
      }
    }
})
.use('riggedHand')
.use('handEntry')
.on('handLost', function(hand){
  delete grabbedHands[hand.id];
});

Leap.loop({enableGestures: true}, function(frame){
  if(frame.valid && frame.gestures.length > 0){
    frame.gestures.forEach(function(gesture){
      if (gesture.type === 'circle'){
        var image = grabbedHands[gesture.handIds[0]];
        if (image == null){
          //ignore

          // tests for now
          var magnitude = gesture.radius;
          var heightMagnitude = 20 * (magnitude/100);
          var widthMagnitude = 12 * (magnitude/100);
          if(gesture.normal[2] > 0){
            // Counter-Clockwise circle
            console.log("Counter Clock");
          }
          else{
            // Clockwise circle
            console.log("Clock");
          }
          console.log("Height Change:"+heightMagnitude);
          console.log("Width Change:"+widthMagnitude);
          // end test

        } else {
          // apply image scaling
          console.log("Circle Gesture with Image");
          var magnitude = gesture.radius;
          var heightMagnitude = 20 * (magnitude/100);
          var widthMagnitude = 12 * (magnitude/100);
          if(gesture.normal[2] > 0){
            // Counter-Clockwise circle
            console.log("Counter Clock");
            image.img.style.width = image.img.style.width - widthMagnitude;
            image.img.style.height = image.img.style.height - heightMagnitude;
          }
          else{
            // Clockwise circle
            console.log("Clock");
            image.img.style.width = image.img.style.width + widthMagnitude;
            image.img.style.height = image.img.style.height + heightMagnitude;
          }
        }
      }
    });
  }
});


riggedHandPlugin = Leap.loopController.plugins.riggedHand;

var idCounter = 0;
var idGenerator = function() {
    return idCounter++;
};

var Image = function(imgNo, type) {

    var image = this;
    var img = document.createElement('img');
    img.id = idGenerator();
    img.src = 'images/images' + imgNo + '.jpg';
    if(type == 'thumbnail'){
        img.style.position = 'absolute';
        img.style.left = '0px';
        var offset =  180 * (imgNo-1);
        img.style.top = offset + 'px';
        img.style.width = '200px';
    }
    else{
        img.style.position = 'absolute';
    }
    // An element with greater stack
    // order is always in front of an element with a lower stack order.
    img.style.zIndex = 2147483640;

    img.onload = function() {
//        image.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
        if(image.type() == 'thumbnail'){
          // document.getElementById('thumbnail').appendChild(img);
          document.body.appendChild(img);
        } else{
          document.getElementById('main').appendChild(img);
        }
        // document.body.appendChild(img);
    }

    image.type = function() {
        return type;
    }

    image.isPointOn = function(position) {
        c = image.center();

        var radians =  -1 * img.style.transform.substring(7, img.style.transform.length - 4);

        var cos = Math.cos(radians),
        sin = Math.sin(radians);

        var nx = (cos * (position[0] - c[0])) - (sin * (position[1] - c[1])) + c[0],
        ny = (sin * (position[0]- c[0])) + (cos * (position[1] - c[1])) + c[1];

        nx -= removePX(img.style.left);
        ny -= removePX(img.style.top);

        return nx <= img.width && ny <= img.height && nx >=0 && ny >= 0;
    };

    image.center = function(){
//      console.log('removePX(img.style.left)');
//      console.log(removePX(img.style.left));
      return[
        centerX = removePX(img.style.left) + removePX(img.style.width)/2,
        centerY = removePX(img.style.top) + removePX(img.style.height)/2
      ];
    };

    image.setTransform = function(position, rotation) {
        img.style.left = position[0] - img.width / 2 + 'px';
        img.style.top = position[1] - img.height / 2 + 'px';
        if(image.type == 'canvas'){
            img.style.zIndex = position[2];
            img.style.transform = 'rotate(' + -rotation + 'rad)';
        }
        img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
        img.style.OTransform = img.style.transform;
    };

    image.deleteElement = function(){
        console.log('calling delete element on cursor with id: ' + img.id);
        var element = document.getElementById(img.id);
        element.parentNode.removeChild(element);
    };
};

var removePX = function(str){
  return str.substring(0, str.length -2) * 1;
};

var grabImage = function(position) {

    console.log('grabbing image at:');
    console.log(position);

    canvasImages.sort(function(obj1, obj2) {
        return obj2.img.style.zIndex - obj1.img.style.zIndex;
    })
    for (image in images) {
        if (images[image].isPointOn(position)) {
            return images[image];
        }
    }
    for (images[image] in canvasImages) {
        if (images[image].isPointOn(position)) {
            return images[image];
        }
    }
    return null;
}

for (var i = 1; i < 5; i++) {
    images.push( new Image(i,'thumbnail'));
}

Leap.loopController.setBackground(true);

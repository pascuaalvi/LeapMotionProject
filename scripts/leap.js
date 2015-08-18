var imgno = 2;
$ = jQuery;

var images = [];
var canvasImages = [];
var grabbedHands = {} // hand id -> Image, or [hand id] is holding [Image]

var options = {
    enableGestures: true
};
var reset = 1;

var riggedHandPlugin;

Leap.loop({
  hand: function(hand){
      var handMesh = hand.data('riggedHand.mesh');
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
                grabbedHands[hand.id].setTransform(screenPosition, hand.rotation);
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
                  if (key == hand.id) {
                      console.log('Error, hand (' + hand.id + ') should not be in grabbedHands')
                      continue;
                  } else if (grabbedHands[key] == image) {
                    ////// if image is already grabbed, return because we cant grab again
                    grabbedHands[hand.id()] = null;
                    return;
                  }
              }

              //check if grabbed image is thumbnail
              //create copy on canvas if it is
              if (image.type() == 'thumbnail'){
                image = new Image(image.imageNumber(), 'canvas');
                image.setTransform(screenPosition, hand.rotation);

              }

              grabbedHands[hand.id] = image;

              image.setTransform(screenPosition, hand.rotation);
          }
      }else{
        delete grabbedHands[hand.id];
      }
    }
})
.use('riggedHand')
.use('handEntry')
.on('handLost', function(hand){
  //TODO if in grabbedHands remove from both grabbedHands and canvas
})
.on('handFound', function(hand){
  var handMesh = hand.data('riggedHand.mesh');
  var handScale = 0.2;
  handMesh.scale = new THREE.Vector3(handScale, handScale, handScale);
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
          }
          else{
            // Clockwise circle
          }
          // end test

        } else {
          // apply image scaling
          var magnitude = gesture.radius;
          var heightMagnitude = 20 * (magnitude/100);
          var widthMagnitude = 12 * (magnitude/100);
          if(gesture.normal[2] > 0){
            // Counter-Clockwise circle
            image.img.style.width = image.img.style.width - widthMagnitude;
            image.img.style.height = image.img.style.height - heightMagnitude;
          }
          else{
            // Clockwise circle
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
        var offset =  180 * (imgNo-1);
        img.style.left = '0px';
        img.style.top = offset + 'px';
        img.style.width = '200px';
        img.style.height = '120px';
    }
    else{
        img.style.position = 'absolute';
        img.style.left = '500px';
        img.style.top = '500px';
        img.style.width = '200px';
        img.style.height = '120px';

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

    image.imageNumber = function(){
      return imgNo;
    }

    image.isPointOn = function(position) {
        c = image.center();


        var radians =  -1 * img.style.transform.substring(7, img.style.transform.length - 4);

        var cos = Math.cos(radians),
        sin = Math.sin(radians);

        var nx = (cos * (position.x - c[0])) - (sin * (position.y - c[1])) + c[0],
        ny = (sin * (position.x- c[0])) + (cos * (position.y - c[1])) + c[1];

        nx -= removePX(img.style.left);
        ny -= removePX(img.style.top);

        return nx <= img.width && ny <= img.height && nx >=0 && ny >= 0;
    };

    image.center = function(){
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
        var element = document.getElementById(img.id);
        element.parentNode.removeChild(element);
    };
};

var removePX = function(str){
  return str.substring(0, str.length -2) * 1;
};

var grabImage = function(position) {
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

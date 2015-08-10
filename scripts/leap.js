var imgno = 2;
$ = jQuery;

var images = {};
var canvasImages = [];
var options = { enableGestures: true };
var last_rotate = 0;
var reset = 1;
var rotation = 0;
///
var knownHands = {} // hand ids to their cursor elements
var grabbedHands = {} // hand id -> Image, or [hand id] is holding [Image]
///

Leap.loop(options,function (frame) {
  var handIds = [];
  for (h in frame.hands){
    handIds.push(frame.hands[h].id);
  }
  console.log('handIds: ' + handIds);
  for (knownHand in knownHands){
    if (!(knownHand in handIds)){
      //delete image if grabbed and remove cursor
      if (knownHand in grabbedHands){
        //// remove hand if in grabbedHands (let go of image) and delete from canvas
        delete canvasImages[grabbedHands[knownHand]];
        delete grabbedHands[knownHand.id];
      }
      // if a known hand has now been removed, forget the hand

      delete knownHands[knownHand];
    }
  }

  // if hand has dissappeared from frame, remove from grabbedHands
    frame.hands.forEach(function (hand, index) {
      // if hand is not known, initialise cursor and remember hand
      if (!(hand.id in knownHands)){
        // console.log( knownHands);
        // console.log('hand.id: ' + hand.id);
        knownHands[hand.id] = new Image(0);
      }

        // if hand is grabbed
        if (hand.grabStrength>0.7) {
          //// if hand id is in grabbedHands
          if (hand.id in grabbedHands){
            ////// apply transformation to image
            document.getElementById("Image").src='images/images'+imgno+'.jpg';
            image.setTransform(hand.screenPosition(), last_rotate);
          }else{
            //// else
            var image = grabImage(hand.screenPosition());
            if (image == null){
              //if hand is freshly grabbed without finding an image
              // grabbedHands[hand.id()] =
              return;
            }else{
              //remove cursor
            }
            ////// find image to grab
            for (key in grabbedHands){
              if (key == hand.id()){
                console.log('Error, hand (' + hand.id + ') should not be in grabbedHands')
                continue;
              } else if (grabbedHands[key] == image){
                continue;
                ////// if image is already grabbed, ignore and continue
              }
            }

            grabbedHands[hand.id] = image;
            ////// put image into grabbedHands
            // document.getElementById("Image").src='images/images'+imgno+'.jpg';
            image.setTransform(hand.screenPosition(), hand.rotation());
            ////// apply transformations
          }
        } else {
          // else
          delete grabbedHands[hand.id];
          //// remove hand if in grabbedHands (let go of image)
        }

        //// update cursor location and image
        knownHands[hand.id].setTransform(hand.screenPosition(), 0);



        ///
        // var image = images[index] || (images[index] = new Image(selected));
        //
        // if (hand.grabStrength>0.7) {
        //     // replace this code by whatever image that is picked up
        //    if (reset==1) {
        //         document.getElementById("Image").src='images/images'+imgno+'.jpg';
        //         image.setTransform(hand.screenPosition(), last_rotate);
        //         reset = 0;
        //    }
        // } else {
        //     reset = 1;
        //     document.getElementById("Image").src='images/circle.png';
        //     image.setTransform(hand.screenPosition(), last_rotate);
        // }
        //
        // if (hand.grabStrength<0.8) {
        //     image.setTransform(hand.screenPosition(), rotation);
        // } else {
        //     roll = hand.roll();
        //     if (roll>0.15 || roll<0.15) {
        //         rotation = roll;
        //         image.setTransform(hand.screenPosition(), rotation);
        //     }
        // }
    });

    // frame.gestures.forEach(function(gesture){
    //   if (gesture.type === circle){
    //     var image = grabbedHands[gesture.handIds[0]];
    //     if (image == null){
    //       //ignore
    //     } else {
    //       // apply image scaling
    //     }
    //   }
    // });
}).use('screenPosition', { scale: 1 });

var idCounter = 0;
var idGenerator = function(){
  return idCounter++;
};

var Image = function(imgNo) {
  var image = this;
  var img = document.createElement('img');
  img.id = idGenerator();
  if (imgNo == 0){
    img.src = 'images/circle.png';
  }else {
    img.src = 'images/images'+imgNo+'.jpg';
  }
  img.style.position = 'inline-block';
  img.style.width = '200px';
  img.style.height = '25%';
  img.onload = function () {
    //image.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    //document.body.appendChild(img);
    $("#thumbnail").append(img);
  }

  image.isPointOn = function(position){
    var pointX = position[0];
    var pointY = position[1];
    // Have to rotate the point around the center of the image
    var angle = -image.angle;
    var newX = Math.cos(angle) * (pointX-this.x) - Math.sin(angle) * (pointY-this.y) + this.x;
    var newY = Math.sin(angle) * (pointX-this.x) + Math.cos(angle) * (pointY-this.y) + this.y;

    // Then we can check if it is within the bounds
    newX = Math.abs(newX);
    newY = Math.abs(newY);
    return newX <= img.width && newY <= img.height;
  };

  image.setTransform = function(position, rotation) {
    if($(this).hasClass("selected")){
      img.style.left = position[0] - img.width  / 2 + 'px';
      img.style.top  = position[1] - img.height / 2 + 'px';
      img.style.zIndex = position[2];

      img.style.transform = 'rotate(' + -rotation + 'rad)';

      img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
      img.style.OTransform = img.style.transform;
    }
  };
};

var grabImage = function(position){
  canvasImages.sort(function(obj1, obj2){
                return obj2.img.style.zIndex - obj1.img.style.zIndex;
              })
  for (image in canvasImages){
    if (image.isOnPoint(position)){
      return image;
    }
  }
  return null;
}

for(var i = 4 ; i < 5 ; i++){
  images[i] = new Image(i);
}

Leap.loopController.setBackground(true);

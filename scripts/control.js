
var grabbedHands = {} // hand id -> Image, or [hand id] is holding [Image]

Leap.loop(function(frame) {
  // if hand has dissappeared from frame, remove from grabbedHands
  frame.hands.forEach(function(hand, index) {
    // if hand is grabbed
    //// if hand id is in grabbedHands
    ////// apply transformation to image
    //// else
    ////// find image to grab
    ////// if image is already grabbed, ignore and continue
    ////// put image into grabbedHands
    ////// apply transformations
    // else
    //// remove hand if in grabbedHands (let go of image)
    //// update cursor location and image

  });
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

}).use('screenPosition', {scale: 0.25});

// This allows us to move the cat even whilst in an iFrame.
Leap.loopController.setBackground(true)
